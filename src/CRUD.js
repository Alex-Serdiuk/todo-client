import React, {useState, useEffect, Fragment} from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import {TastContainer, ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [date, setDate] = useState('2023-10-19');
    const [todos, setTodos] = useState([]);
  
    const [addTitle, setAddTitle] = useState('');
    const [addDescription, setAddDescription] = useState('');
    const [addIsComplete, setAddIsComplete] = useState(false);
    const [addDueDate, setAddDueDate] = useState('');

    const [editId, setEditId] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editIsComplete, setEditIsComplete] = useState(false);
    const [editDueDate, setEditDueDate] = useState('');



    const uri = 'https://localhost:7082/api/tasks';

    const tododata = [
        {
            id: 6,
            title: "test6",
            description: "test6",
            dueDate: "2023-10-20T00:00:00",
            completed: true
        },
        {
            id: 8,
            title: "test8",
            description: "test8",
            dueDate: "2023-10-20T00:00:00",
            completed: false
        },
        {
            id: 10,
            title: "test10",
            description: "teest10",
            dueDate: "2023-10-20T00:00:00",
            completed: false
        }
    ]

    const [data, setData] = useState([]);

    useEffect(()=>{
        getItems();
    },[])

    const getData = () =>{
        axios.get('https://localhost:7082/api/tasks')
        .then((result)=>{
            setData(result.data)
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const getItems = () => {
        axios.get(`${uri}?date=${date}`)
          .then((response) => setData(response.data))
          .catch((error) => console.error('Unable to get items.', error));
      };

      const displayEditForm = (id) => {
        const item = todos.find((item) => item.id === id);
        setEditTitle(item.title);
        setEditDescription(item.description);
        setEditIsComplete(item.completed);
        setEditDueDate(item.dueDate);
        setEditId(item.id);
      };

    const handleEdit = (id)=>{
       // alert(id);
       handleShow();
       axios.get(`${uri}/${id}`)
       .then((result) => {
        setEditTitle(result.data.title);
        setEditDescription(result.data.description);
        setEditIsComplete(result.data.completed);
        const itemDueDate = new Date(result.data.dueDate);
        const formattedDueDate = itemDueDate.toISOString().split('T')[0];
    
        setEditDueDate(formattedDueDate);
        setEditId(id);
       })
       .catch((error)=>{
        console.log(error);
        })
    }

    const handleDelete = (id)=>{
        if(window.confirm("Are you sure to delete this task")===true)
        {
            axios.delete(`${uri}/${id}`)
            .then((result) =>{
                if(result.status === 200)
                {
                    toast.success('Task has been deleted');
                }
                getItems();
            })
            .catch((error) => toast.error('Unable to delete item.', error));
        }
    }

    const handleUpdate =()=>{
        const item = {
            id: editId,
            title: editTitle,
            description: editDescription,
            completed: editIsComplete,
            dueDate: editDueDate,
          };
        
          // Виконуємо PUT-запит для оновлення справи з використанням Axios
          axios.put(`${uri}/${editId}`, item, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(() => {
              getItems();
              toast.success('Task has been updated');
              setEditTitle('');
              setEditDescription('');
              setEditIsComplete(false);
              setEditDueDate('');
            })
            .catch((error) => console.error('Unable to update item.', error));
    }

    const handleSave = () => {
        const item = {
            title: addTitle,
            description: addDescription,
            completed: addIsComplete,
            dueDate: addDueDate,
          };

          axios.post(uri, item, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(() => {
              getItems();
              setAddTitle('');
              setAddDescription('');
              setAddIsComplete(false);
              setAddDueDate('');
              toast.success('Task has been added');
            })
            .catch((error) => toast.error('Unable to add item.', error));
    }

    const toggleTaskCompleted = async (taskId, completed) => {
        try {
          const response = await fetch(`${uri}/${taskId}/completed`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(completed),
          });
    
          if (response.status === 204) {
            getItems();
            // Справа успішно оновлена на сервері
            toast.success('Task has been updated');
          } else {
            // Обробка помилок
            toast.error('Помилка при оновленні статусу виконання справи');
          }
        } catch (error) {
          toast.error('Помилка при виконанні запиту на сервер', error);
        }
      };

    return(
        <Fragment>
            <ToastContainer/>
            <Container>
                <Row>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <button onClick={getItems}>Отримати справи</button>
                </Row>
                <Row>
                    <Col>
                    <input type="checkbox" 
                    checked={addIsComplete} onChange={(e) => setAddIsComplete(e.target.checked)}
                    />
                    <label>IsComplete</label>
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Title"
                    value={addTitle} onChange={(e) => setAddTitle(e.target.value)}
                    />
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Description"
                    value={addDescription} onChange={(e) => setAddDescription(e.target.value)}
                    />
                    </Col>
                    <Col>
                    <input type="date" className="form-control" 
                    value={addDueDate} onChange={(e) => setAddDueDate(e.target.value)}
                    />
                    </Col>
                    <Col>
                    <button className="btn btn-primary" onClick={(e) => handleSave()}>Submit</button>
                    </Col>
                </Row>
            </Container>
    <br></br>
             <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Is Complete?</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>DueDate</th>
                    <th></th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length>0 ?
                        data.map((item, index)=>{
                            return(
                                <tr key={index}>
                                    <td><input type="checkbox" checked={item.completed} onChange={() => toggleTaskCompleted(item.id, !item.completed)}/></td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{item.dueDate}</td>
                                    <td><button className="btn btn-primary" onClick={()=> handleEdit(item.id)}>Edit</button></td>
                                    <td><button className="btn btn-danger" onClick={()=> handleDelete(item.id)}>Delete</button></td>
                
                                </tr>
                            )
                        })
                        :
                        'Loading...'
                    }
                    
                    
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit ToDo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Col>
                    <input type="checkbox" 
                    checked={editIsComplete} onChange={(e) => setEditIsComplete(e.target.checked)}
                    />
                    <label>IsComplete</label>
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Title"
                    value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    />
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Description"
                    value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                    />
                    </Col>
                    <Col>
                    <input type="date" className="form-control" 
                    value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)}
                    />
                    </Col>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        </Fragment>
    )


}
export default CRUD;