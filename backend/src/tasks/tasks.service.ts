import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { randomBytes } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { DeleteResult } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TasksRepository) private tasksRepository: TasksRepository) { }

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto, user)
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id, user } })
        if (!task) throw new NotFoundException(`Task with ID ${id} not found`)
        return task
    }

    createTask(createTaskDto: CreateTaskDto, user: User) {
        return this.tasksRepository.createTask(createTaskDto, user)
    }

    async deleteTask(id: string, user: User): Promise<DeleteResult> {
        await this.getTaskById(id, user)
        const result = await this.tasksRepository.delete(id)
        return result
    }

    async updateTaskById(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
        const { title, description, status } = updateTaskDto
        const foundTask = await this.getTaskById(id, user)
        if (title) {
            foundTask.description = description
        }
        if (description) {
            foundTask.title = title
        }
        if (status) {
            foundTask.status = status
        }
        const saveTask = await this.tasksRepository.save(foundTask)
        return saveTask
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const foundTask = await this.getTaskById(id, user)
        foundTask.status = status
        const saveTask = await this.tasksRepository.save(foundTask)
        return saveTask
    }

}

