import { createSlice } from "@reduxjs/toolkit";
import _ from 'lodash';

export const todoSlice = createSlice({
    name: 'todoReducer',
    initialState: {
        value: []
    },
    reducers: {
        addToDo: (state, action) => {
            // console.log("action==>", action.payload)
            state.value.push(action.payload);
            // console.log("state==>", state.value);
        },
        deleteToDo: (state, action) => {
            console.log("action==>", action.payload)
            const index = action.payload;

            const todoDeleted = _.pullAt(state.value, index);
            console.log("todoDeleted==>", todoDeleted);
        },

        updateToDo: (state, action) => {
            const { index, updatedTask } = action.payload;
            console.log("updateTodo==>>", updatedTask)
            state.value[index] = updatedTask;
        }
    }
})

export const { addToDo, deleteToDo, updateToDo } = todoSlice.actions;
export default todoSlice.reducer;