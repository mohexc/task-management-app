import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {
        // this.taskService = tasksService
    }

    @Get()
    async getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
        return await this.tasksService.getTasks(filterDto)
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Promise<Task> {
        return this.tasksService.getTaskById(id)
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto)
    }

    @Delete('/:id')
    async deleteTask(@Param('id') id: string): Promise<DeleteResult> {
        return await this.tasksService.deleteTask(id)
    }

    @Patch('/:id/status')
    async updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status)
    }

    @Patch('/:id')
    async updateTask(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto
    ): Promise<Task> {
        return this.tasksService.updateTaskById(id, updateTaskDto)
    }

}
