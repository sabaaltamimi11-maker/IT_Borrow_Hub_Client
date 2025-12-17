import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

import axios from 'axios';

export const fetchBorrowings=createAsyncThunk("borrowings/fetchBorrowings",async()=>{

    try{

        const response=await axios.get("https://it-borrowing-system.onrender.com/showBorrowings");

        return response.data;

    }

    catch(error){

        console.log(error);

    }

});

export const fetchUserBorrowings=createAsyncThunk("borrowings/fetchUserBorrowings",async(userId)=>{

    try{

        const response=await axios.get(`https://it-borrowing-system.onrender.com/showBorrowingsByUser/${userId}`);

        return response.data;

    }

    catch(error){

        console.log(error);

    }

});

export const addBorrowing=createAsyncThunk("borrowings/addBorrowing",async(borrowingData)=>{

    try{

        const response=await axios.post("https://it-borrowing-system.onrender.com/saveBorrowing",borrowingData);

        return response.data;

    }

    catch(error){

        console.log(error);

    }

});

export const updateBorrowing=createAsyncThunk("borrowings/updateBorrowing",async({id,borrowingData})=>{

    try{

        const response=await axios.put(`https://it-borrowing-system.onrender.com/updateBorrowing`,{...borrowingData,_id:id});   //

        return response.data;

    }

    catch(error){

        throw error;

    }

});

export const deleteBorrowing=createAsyncThunk("borrowings/deleteBorrowing",async(id)=>{

    try{

        const response=await axios.delete(`https://it-borrowing-system.onrender.com/deleteBorrowing/${id}`);

        return {id,message:response.data.message};

    }

    catch(error){

        console.log(error);

    }

});

const initVal={

    borrowings:[],

    userBorrowings:[],

    message:"",

    isLoading:false,

    isSuccess:false,

    isError:false

}

export const BorrowingSlice=createSlice({

    name:"borrowings",

    initialState:initVal,

    reducers:{},

    extraReducers:(builder)=>{

        builder.addCase(fetchBorrowings.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(fetchBorrowings.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.borrowings=action.payload;

        })

        .addCase(fetchBorrowings.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(fetchUserBorrowings.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(fetchUserBorrowings.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.userBorrowings=action.payload;

        })

        .addCase(fetchUserBorrowings.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(addBorrowing.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(addBorrowing.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.borrowings=[...state.borrowings,action.payload.borrowing];

        })

        .addCase(addBorrowing.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(updateBorrowing.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(updateBorrowing.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload?.message || "Borrowing Updated Successfully";

            if(action.payload?.borrowing && action.payload.borrowing._id){

                state.borrowings=state.borrowings.map((b)=>

                    b._id===action.payload.borrowing._id?action.payload.borrowing:b

                );

                state.userBorrowings=state.userBorrowings.map((b)=>

                    b._id===action.payload.borrowing._id?action.payload.borrowing:b

                );

            }

        })

        .addCase(updateBorrowing.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(deleteBorrowing.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(deleteBorrowing.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.borrowings=state.borrowings.filter((b)=>b._id!==action.payload.id);

            state.userBorrowings=state.userBorrowings.filter((b)=>b._id!==action.payload.id);

        })

        .addCase(deleteBorrowing.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

    }

});

export default BorrowingSlice.reducer;

