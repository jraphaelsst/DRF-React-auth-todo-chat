import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import './style/Message.css'

import { jwtDecode } from 'jwt-decode'
import useAxios from '../utils/useAxios'
import moment from 'moment'


function MessageDetail() {
    const baseUrl = "http://localhost:8000/api"
    const api = useAxios()

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState([])
    let [newMessage, setNewMessage] = useState({message: ''})
    let [newSearch, setNewSearch] = useState({search: ''})
    const [user, setUser] = useState([])


    const token = localStorage.getItem('authTokens')
    const decoded = jwtDecode(token)
    const user_id = decoded.user_id
    const id = useParams([])

    const navigate = useNavigate()


    // Fetch all Messages
    useEffect(() => {
        try {
            api.get(baseUrl + '/my-messages/' + user_id + '/')
            .then((res) => {
                setMessages(res.data)
            })
        } catch(error) {
            console.log(error);
        }
    }, [])


    // Fetch Messages with User with real time update
    useEffect(() => {
        let interval = setInterval(() => {
            try {
                api.get(baseUrl + '/get-messages/' + user_id + '/' + id.id + '/')
                .then((res) => {
                    setMessage(res.data)
                })
            } catch (error) {
                console.log(error)
            }
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [navigate])


    /** Capture changes made by the User in those fields
     *  and update the Component's State accordingly
     */
    const handleChange = (event) => {
        setNewMessage({
            ...newMessage,
            [event.target.name]: event.target.value
        })
    }


    // Send Message functionality
    const SendMessage = () => {
        const formdata = new FormData()

        formdata.append('user', user_id)
        formdata.append('sender', user_id)
        formdata.append('receiver', id.id)
        formdata.append('message', newMessage.message)
        formdata.append('is_read', false)

        try {
            api.post(baseUrl + '/send-message/', formdata)
            .then((res) => {
                document.getElementById('message-input').value = ''
                setNewMessage(newMessage = '')
            })
        } catch(error) {
            console.log(error)
        }
    }


    // 
    const handleSearchChange = (event) => {
        setNewSearch({
            ...newSearch,
            [event.target.name]: event.target.value
        })
    }

    console.log(newSearch)

    const SearchUser = () => {
        api.get(baseUrl + '/search/' + newSearch.username + '/')
        .then((res) => {
            if (res.status === 404) {
                console.log(res.data.detail)
                alert('User does not exist.')
            } else {
                navigate('/search/' + newSearch.username + '/')
                setUser(res.data)
            }
            
        })
    }


    return (
        <div>
            <main className="content" style={{marginTop:"150px"}}>
            <div className="container p-0">
                <h1 className="h3 mb-3">Messages</h1>
                <div className="card">
                <div className="row g-0">
                    <div className="col-12 col-lg-5 col-xl-3 border-right">
                    <div className="px-4 d-none d-md-block">
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <input
                                name='username'
                                onChange={handleSearchChange}
                                // 

                                type="text"
                                className="form-control my-3"
                                placeholder="Search..."
                                />
                                <button
                                    onClick={SearchUser}
                                    className="ml-2"
                                    style={{ border: "none" }}
                                    ><i className="fas fa-seach"></i>
                                    
                                </button>
                            </div>
                        </div>
                    </div>
                    {messages.map((message) =>
                        <Link
                            key={message.receiver_profile.full_name}
                            to={'/inbox/' + (message.sender === user_id ? message.receiver : message.sender)}
                            className="list-group-item list-group-item-action border-0"
                        >
                            <div className="badge bg-success float-right text-white">
                                {moment.utc(message.date).local().startOf('seconds').fromNow()}
                            </div>
                            <div className="d-flex align-items-start">
                                {message.sender === user_id &&
                                    <img
                                        src={message.receiver_profile.image}
                                        className="rounded-circle mr-1"
                                        alt="Vanessa Tucker"
                                        width={40}
                                        height={40}
                                    />
                                }
                                {message.sender !== user_id &&
                                    <img
                                        src={message.sender_profile.image}
                                        className="rounded-circle mr-1"
                                        alt="Vanessa Tucker"
                                        width={40}
                                        height={40}
                                    />
                                }
                            <div className="flex-grow-1 ml-3">
                                {message.sender === user_id &&
                                    message.receiver_profile.full_name
                                }
                                {message.sender !== user_id &&
                                    message.sender_profile.full_name
                                }
                                <div className="small">
                                    <span className="fas fa-circle chat-online" /> {message.message}
                                </div>
                            </div>
                            </div>
                        </Link>
                    )}

                    <hr className="d-block d-lg-none mt-1 mb-0" />
                    </div>
                    <div className="col-12 col-lg-7 col-xl-9">
                    <div className="py-2 px-4 border-bottom d-none d-lg-block">
                        <div className="d-flex align-items-center py-1">
                        <div className="position-relative">
                            <img
                            src="https://bootdey.com/img/Content/avatar/avatar3.png"
                            className="rounded-circle mr-1"
                            alt="Sharon Lessman"
                            width={40}
                            height={40}
                            />
                        </div>
                        <div className="flex-grow-1 pl-3">
                            <strong>Sharon Lessman</strong>
                            <div className="text-muted small">
                            <em>Online</em>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary btn-lg mr-1 px-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-phone feather-lg"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            </button>
                            <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-video feather-lg"
                            >
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
                            </svg>
                            </button>
                            <button className="btn btn-light border btn-lg px-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-more-horizontal feather-lg"
                            >
                                <circle cx={12} cy={12} r={1} />
                                <circle cx={19} cy={12} r={1} />
                                <circle cx={5} cy={12} r={1} />
                            </svg>
                            </button>
                        </div>
                        </div>
                    </div>

                    <div className="position-relative">
                        <div className="chat-messages p-4">
                            {message.map((message, index) =>
                            <>
                                {message.sender === user_id &&
                                    <div className="chat-message-right pb-4">
                                        <div>
                                            <img
                                                src={message.sender_profile.image}
                                                className="rounded-circle mr-1"
                                                alt="Chris Wood"
                                                width={40}
                                                height={40}
                                            />
                                            <div className="text-muted small text-nowrap mt-2">
                                                {moment.utc(message.date).local().startOf('seconds').fromNow()}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                            <div className="font-weight-bold mb-1">{message.sender_profile.full_name}</div>
                                            {message.message}
                                        </div>
                                    </div>
                                }
                                {message.sender !== user_id &&
                                    <div className="chat-message-left pb-4">
                                        <div>
                                            <img
                                                src={message.sender_profile.image}
                                                className="rounded-circle mr-1"
                                                alt="Sharon Lessman"
                                                width={40}
                                                height={40}
                                            />
                                            <div className="text-muted small text-nowrap mt-2">
                                            {moment.utc(message.date).local().startOf('seconds').fromNow()}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                                            <div className="font-weight-bold mb-1">{message.sender_profile.full_name}</div>
                                            {message.message}
                                        </div>
                                    </div>
                                }
                            </>
                            )}


                        </div>
                    </div>

                    <div className="flex-grow-0 py-3 px-4 border-top">
                        <div className="input-group">
                            <input
                                id='message-input'
                                name="message"
                                value={newMessage.message}
                                onChange={handleChange}

                                type="text"
                                className="form-control"
                                placeholder="Type your message"
                            />
                            <button onClick={SendMessage} className="btn btn-primary">Send</button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </main>
        </div>
  )
}

export default MessageDetail