const express = require(`express`);

const server = express();
server.use(express.json());

//localhost:3000/users

const projects = [];

var countReqs = 0;

// Retorna função para comparar um id com um item de um array
function compareId(id) {
  return (item) => (item.id == id);
};

// Encontra indice correspondente a id de um item do array
function findIndex(id) {
  const compareThisId = compareId(id);
  return projects.findIndex(compareThisId);
}

// middleware global
server.use((req, res, next) => {
  countReqs++;
  console.log(`Requisições: ${countReqs}`);
  next();
});

// Middleware para verificação do id no corpo da req
function middlewareCheckBodyId(req, res,next) {
  if (!req.body.id) {
    //bad request
    return res.status(400).json({ error: 'Id missing on the request.'});
  }
  next();
};

// Middleware para verificação do titulo no corpo da req
function middlewareCheckBodyTitle(req, res,next) {
  if (!req.body.title) {
    //bad request
    return res.status(400).json({ error: 'Title missing on the request.'});
  }
  next();
};

// Middleware para verificação do id
function middlewareCheckParamId(req, res,next) {
  if (!req.params.id) {
    //bad request
    return res.status(400).json({ error: 'Id missing on the request.'});
  }
  next();
};

// Middleware para verificação da existência do projeto. Se não existe, sai.
function middlewareCheckProjectExists(req, res,next) {
  const { id } = req.params;
  const index = findIndex(id);
  if (index < 0) {
    //bad request
    return res.status(400).json({ error: 'Project does not exist.'});
  }
  next();
};

// Middleware para verificação da existência do projeto. Se existe, sai.
function middlewareCheckProjectAlreadyExists(req, res,next) {
  const { id } = req.body;
  const index = findIndex(id);
  if (index >= 0) {
    //bad request
    return res.status(400).json({ error: 'Project Id already exists.'});
  }
  next();
};

server.post('/projects',
  middlewareCheckBodyId,
  middlewareCheckProjectAlreadyExists,
  middlewareCheckBodyTitle,
  (req, res) => {
    const { id, title } = req.body;
    projects.push({ id, title, tasks: [] });
    return res.json(projects);
  });

server.get('/projects',
  (req, res) => {
    return res.json(projects);
  });

server.put('/projects/:id',
  middlewareCheckParamId,
  middlewareCheckProjectExists,
  middlewareCheckBodyTitle,
  (req, res) => {
    const { id } = req.params;
    const index = findIndex(id);
    const { title } = req.body;
    projects[index].title = title;
    return res.json(projects);
  });

server.delete('/projects/:id',
  middlewareCheckParamId,
  middlewareCheckProjectExists,
  (req, res) => {
    const { id } = req.params;
    const index = findIndex(id);
    projects.splice(index, 1);
    return res.json(projects);
  });

server.post('/projects/:id/tasks',
  middlewareCheckParamId,
  middlewareCheckProjectExists,
  middlewareCheckBodyTitle,
  (req, res) => {
    const { id } = req.params;
    const index = findIndex(id);
    const { title } = req.body;
    projects[index].tasks.push(title);
    return res.json(projects);
  });

server.listen(3000);
