import { useState } from "react";
import "./Home.css"
import axios from "axios";
function Home(){
const [users,setUsers]=useState([]);
const student=JSON.parse(localStorage.getItem("student"));
  async  function getusers(){
                const reponse=   await  axios.get(`http://localhost:8080/get`);
             setUsers(reponse.data);
             console.log(users)
    }
    async function updateuser(user) {
      const newName = prompt("Enter new name:", user.name);
      const newEmail = prompt("Enter new email:", user.email);

      const updatedDetails={
        name: newName,
        email: newEmail
      };
    try {
  await axios.put(`http://localhost:8080/update/${user.id}`, updatedDetails);
  alert("User Updated Successfully");
  getusers();
} catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);
    console.log("Error:", err);
    alert("User Update failed");
}
    }   
  async function deleteByID(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/delete/${id}`);
      alert("User Deleted Successfully");
      getusers();
    } catch (err) {
      alert("User failed to delete");
    }
  } 
    return (

         <>
         <h1>Dashboard</h1>
         <h2>Welcome User!</h2>

         <button className="get" onClick={getusers}>getUser</button>

         <table>
             <thead>
                    <tr>
                         <th>ID</th>
                         <th>UserName</th>
                         <th>Email</th>
                    </tr>
             </thead>
             <tbody>
               {users.map((user)=>(
                 <tr>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><button className="up" onClick={() => updateuser(user)}>Update</button></td>
                      <td><button className="de" onClick={() => deleteByID(user.id)}>Delete</button></td>
                 </tr>
               ))}
             </tbody>
         </table>
         </>          
    )
}
export default Home