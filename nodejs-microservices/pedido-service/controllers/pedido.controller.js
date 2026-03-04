import Pedido from '../models/Pedido.js';
import fetch from 'node-fetch';
// Função auxiliar para validar cliente
const validarCliente = async (clienteId) => {
    const url = `${process.env.CLIENTE_SERVICE_URL}/${clienteId}`;
 const res = await fetch(url);
 if (!res.ok) {
 throw new Error('Cliente não encontrado');
 }
 return res.json();
};
// Criar um novo pedido
export const createPedido = async (req, res) => {
  try {
    const { clienteId, produtos } = req.body;

    // validar cliente
    await validarCliente(clienteId);

    // validar cada produto
    for (const produtoId of produtos) {
      await validarProduto(produtoId);
    }

    const pedido = await Pedido.create(req.body);

    res.status(201).json(pedido);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Listar todos os pedidos
export const getPedidos = async (req, res) => {
 try {
 const pedidos = await Pedido.findAll();
 res.json(pedidos);
 } catch (err) {
 res.status(500).json({ error: err.message });
 }
};
// Buscar um pedido por ID
export const getPedidoById = async (req, res) => {
 try {
 const pedido = await Pedido.findByPk(req.params.id);
 if (!pedido) {
 return res.status(404).json({ error: 'Pedido não encontrado' });
}
 res.json(pedido);
 } catch (err) {
 res.status(500).json({ error: err.message });
 }
};
// Atualizar um pedido
export const updatePedido = async (req, res) => {
 try {
 const pedido = await Pedido.findByPk(req.params.id);
 if (!pedido) {
 return res.status(404).json({ error: 'Pedido não encontrado' });
 }
 // Se o clienteId foi alterado, valida o novo cliente
 if (req.body.clienteId && req.body.clienteId !== pedido.clienteId) {
 await validarCliente(req.body.clienteId);
 }
 await pedido.update(req.body);
 res.json(pedido);
 } catch (err) {
 res.status(400).json({ error: err.message });
 }
};
// Deletar um pedido
export const deletePedido = async (req, res) => {
 try {
 const pedido = await Pedido.findByPk(req.params.id);
 if (!pedido) {
 return res.status(404).json({ error: 'Pedido não encontrado' });
 }
 await pedido.destroy();
 res.json({ message: 'Pedido deletado com sucesso' });
 } catch (err) {
 res.status(500).json({ error: err.message });
  }
};
//função para validar o produto
const validarProduto = async (produtoId) => {
  const url = `${process.env.PRODUTO_SERVICE_URL}/${produtoId}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Produto ${produtoId} não encontrado`);
  }

  return res.json();
};