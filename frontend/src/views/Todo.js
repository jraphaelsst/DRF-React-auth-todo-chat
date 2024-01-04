import React, { useEffect, useState } from 'react'

import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'

import useAxios from '../utils/useAxios'


const Todo = () => {
    const baseUrl = "http://localhost:8000/api"
    const api = useAxios()

    const token = localStorage.getItem('authTokens')
    const decoded = jwtDecode(token)
    const user_id = decoded.user_id

    const [todo, setTodo] = useState([])
    const [createTodo, setCreateTodo] = useState({'title': '', 'completed': false})
    
    const handleNewTodoTitle = (event) => {

        setCreateTodo({
            ...createTodo,
            [event.target.name]: event.target.value
        })
    }


    useEffect(() => {
        fetchTodos()
    }, [])


    const fetchTodos = async () => {
        await api.get(baseUrl + '/todo/' + user_id + '/').then((res) => {
            setTodo(res.data)
        })
    }
    

    const formSubmit = () => {

        const formdata = new FormData()

        formdata.append('user', user_id)
        formdata.append('title', createTodo.title)
        formdata.append('completed', false)

        try {
            api.post(baseUrl + '/todo/' + user_id + '/', formdata)
            .then((res) => {
                Swal.fire({
                    title: 'Todo Added',
                    icon: 'success',
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: true
                })
                fetchTodos();
                createTodo.title = ''
            })
        } catch(error) {
            console.log(error)
        }
    }


    const deleteTodo = async (todo_id) => {
        await api.delete(baseUrl + '/todo-detail/' + user_id + '/' + todo_id + '/')

        fetchTodos()

        Swal.fire({
            title: 'Todo Removed',
            icon: 'alarm',
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: true
        })
    }

    const markTodoAsComplete = async (todo_id) => {
        await api.patch(baseUrl + '/todo-mark/' + user_id + '/' + todo_id + '/')
        Swal.fire({
            title: 'Todo Completed',
            icon: 'success',
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: true
        })
        fetchTodos()
    }


    return (
    <div>
        <div className="container" style={{marginTop: '150px', padding: '10px'}}>

            <div className="row justify-content-center align-items-center main-row">
                <div className="col shadow main-col bg-white">
                    
                    <div className="row bg-primary text-white">
                        <div className="col p-2">
                            <h4>Todo App</h4>
                        </div>
                    </div>

                    <div className="row justify-content-between text-white p-2">
                        <div className="form-group flex-fill mb-2">
                            <input id="todo-input" name="title" onChange={handleNewTodoTitle} type="text" className="form-control" defaultValue="" placeholder="Write a new todo..." />
                        </div>
                        <button onClick={formSubmit} type="button" className="btn btn-primary mb-2 ml-2">Add Todo</button>
                    </div>

                    <div className="row" id="todo-container">
                        { todo.map((todo) =>
                        <div key={todo.title} className="col col-12 p-2 todo-item">
                            <div className="input-group">
                                {todo.completed.toString() === 'true' &&
                                    <p className="form-control"><strike>{todo.title}</strike></p>
                                }
                                {todo.completed.toString() === 'false' &&
                                    <p className="form-control">{todo.title}</p>
                                }
                                <div className="input-group-append">
                                    <button onClick={() => markTodoAsComplete(todo.id)} className="btn bg-success text-white ml-2" type="button" id="button-addon2"><i className="fas fa-check"></i></button>
                                    <button onClick={() => deleteTodo(todo.id)} className="btn bg-danger text-white me-2 ms-2 ml-2" type="button" id="button-addon2"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    ) }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Todo