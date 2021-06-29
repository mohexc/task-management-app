import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    // taskService: TasksService
    constructor(private tasksService: TasksService) {
        // this.taskService = tasksService
    }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        if (Object.keys(filterDto).length) {
            return this.tasksService.getTasksWithFilters(filterDto)
        }
        return this.tasksService.getAllTasks()
    }

    @Get('/:id')
    getTaskById(
        // @Param() param: { id: string }
        @Param('id') id: string
    ): Task {
        return this.tasksService.getTaskById(id)
    }

    @Post()
    createTask(
        // @Body() body: { title: string, description: string }
        // @Body('title') title: string,
        // @Body('description') description: string
        @Body() createTaskDto: CreateTaskDto
    ) {
        return this.tasksService.createTask(createTaskDto)
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): void {
        return this.tasksService.deleteTask(id)
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto
    ): Task {

        return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status)
    }

}
