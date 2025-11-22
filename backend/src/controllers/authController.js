// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Chave secreta para assinar o token (em produção, isso iria num arquivo .env)
const JWT_SECRET = 'minha_chave_secreta_agenda_123';

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Verificar se usuário já existe
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe.' });
    }

    // 2. Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Criar usuário no banco
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário.', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Buscar usuário
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
    }

    // 2. Comparar a senha enviada com a senha criptografada no banco
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
    }

    // 3. Gerar o Token JWT (O "Crachá")
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h', // Token expira em 1 hora
    });

    res.json({ message: 'Login realizado com sucesso!', token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login.', error });
  }
};