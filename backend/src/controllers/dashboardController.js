// backend/src/controllers/dashboardController.js
const { Op } = require('sequelize');
const Task = require('../models/Task');
const Prova = require('../models/Prova');
const Materia = require('../models/Materia');
const Horario = require('../models/Horario');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const includeMateria = {
      model: Materia,
      as: 'materia',
      where: { userId },
      attributes: ['nome', 'nomenclatura']
    };

    // 1. Estatísticas Gerais
    const totalTasks = await Task.count({ include: [includeMateria] });
    const completedTasks = await Task.count({ where: { status: 'C' }, include: [includeMateria] });
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalProvas = await Prova.count({ include: [includeMateria] });
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const futureProvasCount = await Prova.count({
      where: { data_prova: { [Op.gte]: today } },
      include: [includeMateria]
    });

    const totalMaterias = await Materia.count({ where: { userId } });

    // 2. Listas
    const urgentTasks = await Task.findAll({
      where: { prioridade: 'A', status: { [Op.ne]: 'C' } },
      include: [includeMateria],
      order: [['data_fim', 'ASC']],
      limit: 5
    });

    const nextExams = await Prova.findAll({
      where: { data_prova: { [Op.gte]: today } },
      include: [includeMateria],
      order: [['data_prova', 'ASC']],
      limit: 5
    });

    const nextTasks = await Task.findAll({
      where: { status: { [Op.ne]: 'C' } },
      include: [includeMateria],
      order: [['data_fim', 'ASC']],
      limit: 5
    });

    // 3. LÓGICA DE HORÁRIOS (BLINDADA)
    let scheduleData = { aulasHoje: [], proximaAula: null };
    
    try {
      const hoje = new Date();
      const diaSemana = hoje.getDay(); // 0-6
      // Formata hora atual HH:mm
      const horaAtual = hoje.getHours().toString().padStart(2, '0') + ':' + hoje.getMinutes().toString().padStart(2, '0');

      // Busca matérias do usuário para filtrar horários
      const materiasDoUsuario = await Materia.findAll({ 
          where: { userId },
          attributes: ['id']
      });
      const materiaIds = materiasDoUsuario.map(m => m.id);

      if (materiaIds.length > 0) {
        const aulasHoje = await Horario.findAll({
            where: {
                materiaId: { [Op.in]: materiaIds },
                dia_semana: diaSemana
            },

            include: [{ 
                model: Materia, 
                as: 'materia', 
                attributes: ['nome', 'nomenclatura'] 
            }],
            order: [['hora_inicio', 'ASC']]
        });

        // Encontrar a próxima aula
        const proximaAula = aulasHoje.find(aula => aula.hora_inicio >= horaAtual) || null;
        
        scheduleData = { aulasHoje, proximaAula };
      }
    } catch (err) {
      console.error("Erro ao carregar horários (tabela pode não existir ainda):", err.message);
      // Não faz nada, apenas deixa scheduleData vazio para não travar o dashboard
    }

    // Resposta Final
    res.json({
      stats: { totalTasks, completedTasks, progress, totalProvas, futureProvas: futureProvasCount, totalMaterias },
      lists: { urgentTasks, nextExams, nextTasks },
      schedule: scheduleData // Envia vazio se der erro, ou preenchido se der certo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao carregar dashboard.', error });
  }
};