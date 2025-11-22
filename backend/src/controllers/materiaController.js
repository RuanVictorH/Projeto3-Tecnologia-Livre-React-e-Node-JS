// backend/src/controllers/materiaController.js
const Materia = require('../models/Materia');
const Task = require('../models/Task');
const Horario = require('../models/Horario'); // <--- Importar

// Criar Matéria
exports.create = async (req, res) => {
  try {
    // Recebe também o array de horarios
    const { nome, nomenclatura, notas_materia, link_plano_ensino, horarios } = req.body;
    
    const materia = await Materia.create({
      nome, nomenclatura, notas_materia, link_plano_ensino, userId: req.user.id 
    });

    // Se houver horários, cria eles associados à matéria
    if (horarios && horarios.length > 0) {
      const horariosComId = horarios.map(h => ({ ...h, materiaId: materia.id }));
      await Horario.bulkCreate(horariosComId);
    }
    
    res.status(201).json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar matéria.', error });
  }
};

// Listar Matérias (Incluir Horários)
exports.findAll = async (req, res) => {
  try {
    const materias = await Materia.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Task },
        { model: Horario, as: 'horarios' } // <--- Incluir horários na listagem
      ] 
    });

    const dadosFormatados = materias.map(m => {
      const materia = m.toJSON();
      const tarefas = materia.Tasks || [];
      const total = tarefas.length;
      const concluidas = tarefas.filter(t => t.status === 'C').length;
      const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

      return { ...materia, progresso, totalTasks: total, completedTasks: concluidas };
    });

    res.json(dadosFormatados);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar matérias.', error });
  }
};

// Atualizar Matéria
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { horarios, ...dadosMateria } = req.body; // Separa horários do resto

    const materia = await Materia.findOne({ where: { id, userId: req.user.id } });
    if (!materia) return res.status(404).json({ message: 'Matéria não encontrada.' });

    // 1. Atualiza dados básicos
    await materia.update(dadosMateria);

    // 2. Atualiza Horários (Apaga antigos e cria novos - estratégia mais segura)
    if (horarios) {
      await Horario.destroy({ where: { materiaId: id } }); // Limpa
      if (horarios.length > 0) {
        const novosHorarios = horarios.map(h => ({ ...h, materiaId: id }));
        await Horario.bulkCreate(novosHorarios);
      }
    }

    res.json(materia);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar matéria.', error });
  }
};

// Deletar (O banco já faz cascade delete nos horários, então mantém igual)
exports.delete = async (req, res) => {
    // ... (código existente mantém igual)
    try {
        const { id } = req.params;
        const deleted = await Materia.destroy({ where: { id, userId: req.user.id } });
        if (!deleted) return res.status(404).json({ message: 'Matéria não encontrada.' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar.', error });
    }
};