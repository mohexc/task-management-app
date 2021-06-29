import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { randomBytes } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { DeleteResult } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TasksRepository) private tasksRepository: TasksRepository) { }

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto)
    }

    async getTaskById(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne(id)
        if (!task) throw new NotFoundException(`Task with ID ${id} not found`)
        return task
    }

    createTask(createTaskDto: CreateTaskDto) {
        return this.tasksRepository.createTask(createTaskDto)
    }

    async deleteTask(id: string): Promise<DeleteResult> {
        await this.getTaskById(id)
        const result = await this.tasksRepository.delete(id)
        return result
    }

    async updateTaskById(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const { title, description, status } = updateTaskDto
        const foundTask = await this.getTaskById(id)
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

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const foundTask = await this.getTaskById(id)
        foundTask.status = status
        const saveTask = await this.tasksRepository.save(foundTask)
        return saveTask
    }

}

