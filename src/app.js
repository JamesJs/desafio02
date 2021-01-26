const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid, v4, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


const validateId = (request,response,next)=>{
  const {id} = request.params;

  if(!validate(id)){
    return response.status(400).json({error:"id is not valid"})
  }
  return next();
}


const findRepository = (request,response,next)=>{
  const {id} = request.params;
  const indexRepository = repositories.findIndex(r=>r.id === id);
  
  if(indexRepository < 0){
    return response.status(400).json({error:"repository not found"});
  }
   request.repository = {
    id,
    title:request.body.title,
    url:request.body.url,
    techs:request.body.techs,
    likes:repositories[indexRepository].likes

  };
  request.indexRepository = indexRepository;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const {title,url,techs} = request.body;
  const repository = {
    id:uuid(),
    title,
    url,
    techs,
    likes:0
  };
  if(title === '' || url ===''||techs ===[]){
    return response.status(400).json({error:"You should send all infos."});
  }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id",validateId,findRepository, (request, response) => {
  
  const indexRepository = request.indexRepository;
  repositories[indexRepository] = request.repository;
  return response.json(request.repository);

});

app.delete("/repositories/:id",validateId, findRepository,(request, response) => {
  indexRepository = request.indexRepository;
  repositories.splice(indexRepository,1);
  return response.status(204).send(); // deve colocar o send pois senão a request não termina nunca.
});

app.post("/repositories/:id/like",validateId,findRepository, (request, response) => {
  repositories[request.indexRepository].likes++;
  return response.json({likes:repositories[request.indexRepository].likes});
  
});

module.exports = app;
