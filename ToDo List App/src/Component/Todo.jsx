import React, { useState } from 'react';
import {
    Box, Button, Typography, Modal, TextField,
    Select, MenuItem, InputLabel, FormControl,
    Stack, Paper, IconButton, Container
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addToDo, deleteToDo, updateToDo } from '../feature/todo/todoSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 360,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

function Todo() {
    const dispatch = useDispatch();
    const todoList = useSelector(state => state.todos.value);

    const [open, setOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [filter, setFilter] = useState("All");

    const formik = useFormik({
        initialValues: {
            title: '',
            status: 'Incomplete',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            status: Yup.string().required('Status is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log("values==>", values);
            if (editIndex !== null) {
                console.log("Inside onsubmit if condition")
                dispatch(updateToDo({ index: editIndex, updatedTask: values }));
                setEditIndex(null);
            } else {
                console.log("Inside onsubmit else condition")

                dispatch(addToDo(values));
            }
            resetForm();
            setOpen(false);
        },
    });

    const handleOpen = () => {
        formik.resetForm();
        setEditIndex(null);
        setOpen(true);
    };

    const handleClose = () => {
        formik.resetForm();
        setEditIndex(null);
        setOpen(false);
    };

    const handleDelete = (index) => {
        dispatch(deleteToDo(index));
    };

    const handleEdit = (index) => {
        const task = todoList[index];
        formik.setValues({ title: task.title, status: task.status });
        setEditIndex(index);
        setOpen(true);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredTasks = todoList.filter(task =>
        filter === 'All' ? true : task.status === filter
    );

    return (
        <Box sx={{ backgroundColor: '#f7f7fb', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="sm">
                <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
                    TODO LIST
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#6c73f2', fontWeight: 600 }}>
                        Add Task
                    </Button>
                    <FormControl size="small" sx={{ minWidth: 150, backgroundColor: '#d6d6e0', borderRadius: 1 }}>
                        <InputLabel>Filter</InputLabel>
                        <Select label="Filter" value={filter} onChange={handleFilterChange}>
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Incomplete">Incomplete</MenuItem>
                            <MenuItem value="Complete">Complete</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Stack spacing={2}>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((item, index) => (

                            <Paper
                                key={index}
                                elevation={1}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e0e0e0',
                                }}
                            >
                                <Box>
                                    <Typography fontWeight={600}>{item.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.status}
                                    </Typography>
                                </Box>
                                <Box>
                                    <IconButton onClick={() => handleDelete(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEdit(index)}>
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                            </Paper>
                        ))
                    ) : (
                        <Typography align="center" color="text.secondary">
                            No tasks found.
                        </Typography>
                    )}
                </Stack>
            </Container>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        {editIndex !== null ? 'Update TODO' : 'Add TODO'}
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Title"
                                name="title"
                                fullWidth
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={formik.values.status}
                                    label="Status"
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value="Incomplete">Incomplete</MenuItem>
                                    <MenuItem value="Complete">Complete</MenuItem>
                                </Select>
                            </FormControl>
                            <Box display="flex" justifyContent="space-between">
                                <Button type="submit" variant="contained" color="primary">
                                    {editIndex !== null ? 'Update Task' : 'Add Task'}
                                </Button>
                                <Button onClick={handleClose} variant="outlined" color="secondary">
                                    Cancel
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
}

export default Todo;
