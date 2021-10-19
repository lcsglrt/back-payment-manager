# Payment Manager - Desafio Cubos Academy

## Desenvolvedores 
- [Estefane Luz](https://github.com/estefaneluz)
- [Lucas Goulart](https://github.com/glrtlucas)

#### Link  [⛓️https://api-payment-manager.herokuapp.com](https://api-payment-manager.herokuapp.com)
#### [Repositório do Front-end](https://github.com/estefaneluz/front-payment-manager)

## Sobre
> API de uma aplicação para cadastrar e gerenciar cobranças de clientes.

## Tecnologias / Bibliotecas

```
- Nodesjs
- express
- Banco Postgresql
- Knex 
- bcrypt
- date-fns
- jsonwebtoken
- lodash
- yup 
``` 

## Endpoints

### Usuários
- Cadastrar usuário
    - POST /cadastrar
- Login
    - POST /login
- Listar usuário
    - GET /perfil
- Editar usuário
    - PUT /perfil

### Clientes
- Registrar cliente
    - POST /clientes
- Listar todos clientes
    - GET /clientes
- Listar nome de todos os clientes
    - GET /nomes-clientes
- Detalhar cliente por id
    - GET /detalhes-cliente/:id
- Listar perfil do cliente
    - GET /perfil-clientes/:id
- Editar cliente
    - PUT /clientes/:id 

### Cobranças
- Registrar cobrança
    - POST /cobrancas
- Listar todos cobranças
    - GET /cobrancas
- Editar cobrança
    - PUT /cobrancas/:id
- Listar cobrança por id
    - GET /cobrancas/:id
- Deletar cobrança
    - GET /cobrancas/:id

### Relatórios
- Contar status do cliente e cobrança
    - GET /relatorios
- Listar clientes por status
    - GET /relatorios/clientes?status='em-dia'
- Listar cobranças por status
    - GET /relatorios/cobrancas?status='pendente'
