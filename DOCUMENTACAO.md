# Documentação - Módulo Pessoa

## Descrição
Projeto NestJS com módulo Pessoa completo, utilizando banco de dados SQLite e TypeORM.

## Entidade Pessoa
| Campo | Tipo   | Descrição        |
|-------|--------|------------------|
| id    | number | Chave primária   |
| nome  | string | Nome da pessoa   |
| email | string | E-mail da pessoa |
| idade | number | Idade da pessoa  |

## Rotas CRUD
| Método | Rota        | Descrição                  |
|--------|-------------|----------------------------|
| POST   | /pessoa     | Cria uma nova pessoa       |
| GET    | /pessoa     | Lista todas as pessoas     |
| GET    | /pessoa/:id | Busca uma pessoa por ID    |
| PUT    | /pessoa/:id | Atualiza uma pessoa por ID |
| DELETE | /pessoa/:id | Remove uma pessoa por ID   |

## Inserções Realizadas

### Inserção 1
{"nome": "Ana Silva", "email": "ana@email.com", "idade": 22}

### Inserção 2
{"nome": "Karla Victoria", "email": "karla.barbosa@sou.ufmt.br", "idade": 17}

## Seleção de Todos os Registros
[{"id":1,"nome":"Ana Silva","email":"ana@email.com","idade":22},{"id":2,"nome":"Karla Victoria","email":"karla.barbosa@sou.ufmt.br","idade":17}]
