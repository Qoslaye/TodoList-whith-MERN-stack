import { useState } from "react";

export default function Todo(props) {
    const { todo, setTodos } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [newTodoContent, setNewTodoContent] = useState(todo.todo);

    const updateTodoStatus = async (todoId, todoStatus) => {
        const res = await fetch(`/api/todos/${todoId}`, {
            method: "PUT",
            body: JSON.stringify({ status: !todoStatus }),
            headers: {
                "Content-Type": "application/json"
            },
        });

        const json = await res.json();
        if (json.acknowledged) {
            setTodos(currentTodos => {
                return currentTodos.map((currentTodo) => {
                    if (currentTodo._id === todoId) {
                        return { ...currentTodo, status: !currentTodo.status };
                    }
                    return currentTodo;
                });
            });
        }
    };

    const deleteTodo = async (todoId) => {
        const res = await fetch(`/api/todos/${todoId}`, {
            method: "DELETE"
        });
        const json = await res.json();
        if (json.acknowledged) {
            setTodos(currentTodos => {
                return currentTodos.filter((currentTodo) => (currentTodo._id !== todoId));
            })
        }
    };

    const saveUpdatedTodo = async (todoId) => {
        const res = await fetch(`/api/todos/${todoId}`, {
            method: "PUT",
            body: JSON.stringify({ todo: newTodoContent }),
            headers: {
                "Content-Type": "application/json"
            },
        });
    
        

        const json = await res.json();
        if (json.modifiedCount > 0) { // Ensure the update was successful
            setTodos(currentTodos => {
                return currentTodos.map((currentTodo) => {
                    if (currentTodo._id === todoId) {
                        return { ...currentTodo, todo: newTodoContent };
                    }
                    return currentTodo;
                });
            });
            setIsEditing(false);
        }
    };
    

    return (
        <div className="todo">
            {isEditing ? (
                <input
                    type="text"
                    value={newTodoContent}
                    onChange={(e) => setNewTodoContent(e.target.value)}
                />
            ) : (
                <p className={todo.status ? "line-through" : ""}>{todo.todo}</p>
            )}
            <div className="mutations">
                <button
                    className="todo__status"
                    onClick={() => updateTodoStatus(todo._id, todo.status)}
                >
                    {todo.status ? "☑" : "☐"}
                </button>
                {isEditing ? (
                    <button
                        className="todo__save"
                        onClick={() => saveUpdatedTodo(todo._id)}
                    >
                       
                    </button>
                ) : (
                    <button
                        className="todo__edit"
                        onClick={() => setIsEditing(true)}
                    >
                        
                    </button>
                )}
                <button
                    className="todo__delete"
                    onClick={() => deleteTodo(todo._id)}
                >
                   
                </button>
            </div>
        </div>
    )
}
