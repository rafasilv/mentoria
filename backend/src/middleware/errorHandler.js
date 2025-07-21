const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);

  // Erros de validação do Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Dados duplicados',
      message: 'Já existe um registro com essas informações'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado',
      message: 'O item solicitado não foi encontrado'
    });
  }

  // Erros de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      message: err.message
    });
  }

  // Erro padrão
  res.status(err.status || 500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
};

module.exports = { errorHandler }; 