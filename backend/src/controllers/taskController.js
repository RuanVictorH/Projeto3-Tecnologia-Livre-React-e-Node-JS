// backend/src/controllers/taskController.js
const Task = require('../models/Task');
const Materia = require('../models/Materia');

// Criar Tarefa
exports.create = async (req, res) => {
  try {
    const { titulo, descricao, data_fim, status, prioridade, link_anexo, materiaId } = req.body;
    
    const materia = await Materia.findOne({ where: { id: materiaId, userId: req.user.id } });
    
    if (!materia) {
      return res.status(403).json({ message: 'Matéria inválida ou não pertence a você.' });
    }

    const task = await Task.create({
      titulo, descricao, data_fim, status, prioridade, link_anexo, materiaId
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa.', error });
  }
};

// Listar Tarefas (COM FILTROS)
exports.findAll = async (req, res) => {
  try {
    // Extrair filtros da URL (query params)
    const { materiaId, status, prioridade } = req.query;

    // Construir o objeto de filtro dinamicamente
    const whereClause = {};

    // Filtro 1: Apenas tarefas das matérias do usuário (Segurança Base)
    // A verificação de userId é feita no include da Matéria, mas aqui filtramos pelo ID específico se enviado
    if (materiaId) whereClause.materiaId = materiaId;
    
    // Filtro 2: Status (Se enviado)
    if (status) whereClause.status = status;

    // Filtro 3: Prioridade (Se enviado)
    if (prioridade) whereClause.prioridade = prioridade;

    const tasks = await Task.findAll({
      where: whereClause,
      include: [{
        model: Materia,
        as: 'materia',
        where: { userId: req.user.id }, // Garante que só traz tarefas do usuário
        attributes: ['nome', 'nomenclatura']
      }],
      order: [['data_fim', 'ASC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar tarefas.', error });
  }
};

// Atualizar Tarefa (Patch ou Put)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id },
      include: [{ model: Materia, as: 'materia', where: { userId: req.user.id } }]
    });

    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa.', error });
  }
};

// Deletar Tarefa
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id },
      include: [{ model: Materia, as: 'materia', where: { userId: req.user.id } }]
    });

    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar tarefa.', error });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id },
      include: [{ 
        model: Materia, 
        as: 'materia', 
        where: { userId: req.user.id } 
      }]
    });

    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefa.', error });
  }
};