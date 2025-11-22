// backend/src/routes.js
const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const materiaController = require('./controllers/materiaController'); 
const authMiddleware = require('./middleware/auth'); 
const provaController = require('./controllers/provaController');
const taskController = require('./controllers/taskController'); 
const dashboardController = require('./controllers/dashboardController');
const newsController = require('./controllers/newsController');
const weatherController = require('./controllers/weatherController');

// Rotas Públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas Protegidas (Matérias)
// Todas as rotas abaixo passarão pelo authMiddleware
router.post('/materias', authMiddleware, materiaController.create);
router.get('/materias', authMiddleware, materiaController.findAll);
router.put('/materias/:id', authMiddleware, materiaController.update);
router.delete('/materias/:id', authMiddleware, materiaController.delete);

// Rotas de Provas
router.post('/provas', authMiddleware, provaController.create);
router.get('/provas', authMiddleware, provaController.findAll);
router.put('/provas/:id', authMiddleware, provaController.update);
router.delete('/provas/:id', authMiddleware, provaController.delete);

// --- ROTAS DE TAREFAS ---
router.post('/tasks', authMiddleware, taskController.create);
router.get('/tasks', authMiddleware, taskController.findAll);
router.get('/tasks/:id', authMiddleware, taskController.findOne);
router.put('/tasks/:id', authMiddleware, taskController.update);
router.delete('/tasks/:id', authMiddleware, taskController.delete);

// Rota do Dashboard
router.get('/dashboard', authMiddleware, dashboardController.getDashboardData);

// Rota de Notícias (Pode ser protegida ou pública, vamos proteger para manter padrão)
router.get('/news', newsController.getTechNews);

// Rota de Clima
router.get('/weather', authMiddleware, weatherController.getWeatherLavras);

module.exports = router;