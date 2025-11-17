import { Usuario } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const get = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      return res.status(200).json(usuario);
    }
    
    const usuarios = await Usuario.findAll({
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (body) => {
  try {
    if (!body.senhaHash) {
      throw new Error('Senha é obrigatória');
    }

    const verificaEmail = await Usuario.findOne({ where: { email: body.email } });
    if (verificaEmail) {
      throw new Error('Email já cadastrado');
    }

    // Criptografar a senha com bcrypt
    const saltRounds = 10;
    const senhaHashCriptografada = await bcrypt.hash(body.senhaHash, saltRounds);

    // Criar usuário com senha criptografada
    const usuario = await Usuario.create({
      ...body,
      senhaHash: senhaHashCriptografada
    });

    return usuario;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (body, id) => {
  try {
    const dataToUpdate = { ...body };

    // Se senhaHash foi enviada, criptografar
    if (body.senhaHash) {
      const saltRounds = 10;
      dataToUpdate.senhaHash = await bcrypt.hash(body.senhaHash, saltRounds);
    }

    const [updatedRows] = await Usuario.update(dataToUpdate, {
      where: { id }
    });

    if (updatedRows === 0) {
      throw new Error('Usuário não encontrado');
    }

    const usuario = await Usuario.findByPk(id);
    return usuario;
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Usuario.destroy({
      where: { id }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const persist = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id) {
      // Update
      const usuario = await update(req.body, id);
      res.status(200).json(usuario);
    } else {
      // Create
      const usuario = await create(req.body);
      res.status(201).json(usuario);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { login, senha } = req.body;
    
    const usuario = await Usuario.findOne({ where: { login } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (senhaValida) {
      const token = jwt.sign({ 
        id: usuario.id, 
        login: usuario.login,
        email: usuario.email,
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ usuario, token });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { get, create, update, destroy, persist, login };