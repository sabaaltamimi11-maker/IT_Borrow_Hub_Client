import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

import axios from 'axios';

export const login=createAsyncThunk("auth/login",async(udata)=>{

    try{

        const response=await axios.post("https://it-borrowing-system.onrender.com/login",udata);

        return response.data;

    }

    catch(error){

        console.log(error);

    }

});

export const register=createAsyncThunk("auth/register",async(udata)=>{

    try{

        const response=await axios.post("https://it-borrowing-system.onrender.com/register",udata);

        return response.data.message;

    }

    catch(error){

        console.log(error);

    }

});

const initVal={

    user:JSON.parse(localStorage.getItem("user"))||null,

    message:"",

    isLoading:false,

    isSuccess:false,

    isError:false

}

export const AuthSlice=createSlice({

    name:"auth",

    initialState:initVal,

    reducers:{

        logout:(state,action)=>{

            localStorage.removeItem("user");

            state.user=null;

            state.message="";

            state.isSuccess=false;

            state.isError=false;

        },

        updateUser:(state,action)=>{

            const updatedUser={...state.user,...action.payload};

            localStorage.setItem("user",JSON.stringify(updatedUser));

            state.user=updatedUser;

        }

    },

    extraReducers:(builder)=>{

        builder.addCase(login.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(login.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.user=action.payload.user;

            localStorage.setItem("user",JSON.stringify(action.payload.user));

        })

        .addCase(login.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(register.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(register.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload;

        })

        .addCase(register.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

    }

});

export const {logout,updateUser}=AuthSlice.actions;

export default AuthSlice.reducer;
