import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

import axios from 'axios';

export const fetchUsers=createAsyncThunk("users/fetchUsers",async()=>{

    try{

        const response=await axios.get("https://it-borrowing-system.onrender.com/showUsers");

        return response.data;

    }

    catch(error){

        throw error;

    }

});

export const updateUser=createAsyncThunk("users/updateUser",async({id,userData})=>{

    try{

        const response=await axios.put(`https://it-borrowing-system.onrender.com/updateUser`,{...userData,_id:id});

        return response.data;

    }

    catch(error){

        throw error;

    }

});

export const deleteUser=createAsyncThunk("users/deleteUser",async(id)=>{

    try{

        const response=await axios.delete(`https://it-borrowing-system.onrender.com/deleteUser/${id}`);

        return {id,message:response.data.message};

    }

    catch(error){

        throw error;

    }

});

const initVal={

    users:[],

    message:"",

    isLoading:false,

    isSuccess:false,

    isError:false

}

export const UserSlice=createSlice({

    name:"users",

    initialState:initVal,

    reducers:{},

    extraReducers:(builder)=>{

        builder.addCase(fetchUsers.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(fetchUsers.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.users=action.payload;

        })

        .addCase(fetchUsers.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(updateUser.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(updateUser.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.users=state.users.map((u)=>

                u._id===action.payload.user._id?action.payload.user:u

            );

        })

        .addCase(updateUser.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(deleteUser.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(deleteUser.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.users=state.users.filter((u)=>u._id!==action.payload.id);

        })

        .addCase(deleteUser.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

    }

});

export default UserSlice.reducer;

