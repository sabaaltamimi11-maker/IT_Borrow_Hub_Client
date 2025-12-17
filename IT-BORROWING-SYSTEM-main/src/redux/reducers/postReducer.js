import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";

import axios from 'axios';

export const fetchPosts=createAsyncThunk("posts/fetchPosts",async()=>{

    try{

        const response=await axios.get("https://it-borrowing-system.onrender.com/showPosts");

        return response.data;

    }

    catch(error){

        console.log(error);

    }

});

export const fetchDevicePosts=createAsyncThunk("posts/fetchDevicePosts",async(deviceId)=>{

    try{

        const response=await axios.get(`https://it-borrowing-system.onrender.com/showPostsByDevice/${deviceId}`);

        return response.data;

    }

    catch(error){

        console.log(error);

    }

});

export const addPost=createAsyncThunk("posts/addPost",async(postData)=>{

    try{

        const response=await axios.post("https://it-borrowing-system.onrender.com/savePost",postData);

        return response.data;

    }

    catch(error){

        throw error;

    }

});

export const updatePost=createAsyncThunk("posts/updatePost",async({id,postData})=>{

    try{

        const response=await axios.put(`https://it-borrowing-system.onrender.com/updatePost`,{...postData,_id:id});

        return response.data;

    }

    catch(error){

        throw error;

    }

});

export const deletePost=createAsyncThunk("posts/deletePost",async(id)=>{

    try{

        const response=await axios.delete(`https://it-borrowing-system.onrender.com/delPost/${id}`);

        return {id,message:response.data.message};

    }

    catch(error){

        throw error;

    }

});

export const likePost=createAsyncThunk("posts/likePost",async({id,userId})=>{

    try{

        const response=await axios.post(`https://it-borrowing-system.onrender.com/likePost/${id}`,{userId});

        return response.data;

    }

    catch(error){

        throw error;

    }

});

export const dislikePost=createAsyncThunk("posts/dislikePost",async({id,userId})=>{

    try{

        const response=await axios.post(`https://it-borrowing-system.onrender.com/dislikePost/${id}`,{userId});

        return response.data;

    }

    catch(error){

        throw error;

    }

});

const initVal={

    posts:[],

    devicePosts:[],

    message:"",

    isLoading:false,

    isSuccess:false,

    isError:false

}

export const PostSlice=createSlice({

    name:"posts",

    initialState:initVal,

    reducers:{},

    extraReducers:(builder)=>{

        builder.addCase(fetchPosts.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(fetchPosts.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.posts=action.payload;

        })

        .addCase(fetchPosts.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(fetchDevicePosts.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(fetchDevicePosts.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.devicePosts=action.payload;

        })

        .addCase(fetchDevicePosts.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(addPost.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(addPost.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.posts=[action.payload.post,...state.posts];

        })

        .addCase(addPost.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(updatePost.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(updatePost.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.posts=state.posts.map((p)=>

                p._id===action.payload.post._id?action.payload.post:p

            );

            state.devicePosts=state.devicePosts.map((p)=>

                p._id===action.payload.post._id?action.payload.post:p

            );

        })

        .addCase(updatePost.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(deletePost.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(deletePost.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.posts=state.posts.filter((p)=>p._id!==action.payload.id);

            state.devicePosts=state.devicePosts.filter((p)=>p._id!==action.payload.id);

        })

        .addCase(deletePost.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(likePost.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(likePost.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.posts=state.posts.map((p)=>

                p._id===action.payload.post._id?action.payload.post:p

            );

            state.devicePosts=state.devicePosts.map((p)=>

                p._id===action.payload.post._id?action.payload.post:p

            );

        })

        .addCase(likePost.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

        .addCase(dislikePost.pending,(state,action)=>{

            state.isLoading=true

        })

        .addCase(dislikePost.fulfilled,(state,action)=>{

            state.isLoading=false;

            state.isSuccess=true;

            state.message=action.payload.message;

            state.posts=state.posts.map((p)=>

                p._id===action.payload.post._id?action.payload.post:p

            );

            state.devicePosts=state.devicePosts.map((p)=>

                p._id===action.payload.post._id?action.payload.post:p

            );

        })

        .addCase(dislikePost.rejected,(state,action)=>{

            state.isLoading=false;

            state.isError=true;

        })

    }

});

export default PostSlice.reducer;

