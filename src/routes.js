import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { dataAtual, validaCampos } from './utils/util.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
        completed_at: search,
        created_at: search,
        updated_at: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if(validaCampos(title, description) == true){
        return res.writeHead(400).end(JSON.stringify("mensagem: É necessario inlcuir os campos title e description"))
      }
      
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: dataAtual(),
        updated_at: dataAtual(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description} = req.body

      if(validaCampos(title, description) == true){
        return res.writeHead(400).end(JSON.stringify("mensagem: É necessario inlcuir os campos title e description"))
      }

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end()
      }

      database.update('tasks', id, {
        title,
        description,
        completed_at: task.completed_at,
        created_at: task.created_at,
        updated_at: dataAtual(),
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end()
      }

      const isTaskComplete = !!task.completed_at

      const completed_at = isTaskComplete ? null : dataAtual()

      database.update('tasks', id, {
        title: task.title,
        description: task.description,
        completed_at,
        created_at: task.created_at,
        updated_at: dataAtual(),
      })

      return res.writeHead(204).end()
    }
  }
]