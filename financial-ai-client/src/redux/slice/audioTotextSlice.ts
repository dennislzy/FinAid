import { createSlice } from '@reduxjs/toolkit';
interface InitialState{
    content:string,
    summary:string,
    loading:boolean
}
const initialState:InitialState={
    content:'',
    summary:'',
    loading:false
}

const slice=createSlice({
    name:'audioTotext',
    initialState,
    reducers:{
        setAudioTotext:(state,action)=>{
            state.content=action.payload
        },
        setSummary:(state,action)=>{
            state.summary=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        }
    }
})

export const {setAudioTotext,setSummary,setLoading} = slice.actions

export default slice.reducer

