import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {
        // this.taskService = tasksService
    }

    @Get()
    async getTasks(
        @Query() filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        return await this.tasksService.getTasks(filterDto, user)
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User,): Promise<Task> {
        return this.tasksService.getTaskById(id, user)
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user)
    }

    @Delete('/:id')
    async deleteTask(@Param('id') id: string, @GetUser() user: User,): Promise<DeleteResult> {
        return await this.tasksService.deleteTask(id, user)
    }

    @Patch('/:id/status')
    async updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status, user)
    }

    @Patch('/:id')
    async updateTask(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.updateTaskById(id, updateTaskDto, user)
    }

}
