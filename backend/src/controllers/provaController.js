// backend/src/controllers/provaController.js
const Prova = require('../models/Prova');
const Materia = require('../models/Materia');

// Criar Prova
exports.create = async (req, res) => {
  try {
    const { titulo, data_prova, observacoes, link_anexos, materiaId } = req.body;
    
    const materia = await Materia.findOne({ where: { id: materiaId, userId: req.user.id } });
    if (!materia) {
      return res.status(403).json({ message: 'Matéria inválida.' });
    }

    const prova = await Prova.create({
      titulo, data_prova, observacoes, link_anexos, materiaId
    });
    
    res.status(201).json(prova);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar prova.', error });
  }
};

// Listar Provas (CORRIGIDO)
exports.findAll = async (req, res) => {
  try {
    const provas = await Prova.findAll({
      include: [{
        model: Materia,
        as: 'materia', // <--- ADICIONADO O ALIAS CORRETO
        where: { userId: req.user.id },
        attributes: ['nome', 'nomenclatura']
      }],
      order: [['data_prova', 'ASC']]
    });
    res.json(provas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar provas.', error });
  }
};

// Atualizar Prova (CORRIGIDO)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const prova = await Prova.findOne({
      where: { id },
      // ADICIONADO O ALIAS CORRETO
      include: [{ model: Materia, as: 'materia', where: { userId: req.user.id } }]
    });

    if (!prova) return res.status(404).json({ message: 'Prova não encontrada.' });

    await prova.update(req.body);
    res.json(prova);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar prova.', error });
  }
};

// Deletar Prova (CORRIGIDO)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const prova = await Prova.findOne({
      where: { id },
      // ADICIONADO O ALIAS CORRETO
      include: [{ model: Materia, as: 'materia', where: { userId: req.user.id } }]
    });

    if (!prova) return res.status(404).json({ message: 'Prova não encontrada.' });

    await prova.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar prova.', error });
  }
};