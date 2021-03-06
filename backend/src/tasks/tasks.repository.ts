import { User } from "../auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { Task } from "./task.entity";
import { TaskStatus } from "./task.model";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { search, status } = filterDto
        const query = this.createQueryBuilder('task')
        query.where({ user })

        if (status) {
            query.andWhere('task.status = :status', { status })
        }
        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` }
            )
        }
        const tasks = await query.getMany()
        return tasks
    }

    async createTask(createTaskDto: CreateTaskDto, user: User) {
        const { title, description } = createTaskDto
        const crateTask = this.create({ title, description, status: TaskStatus.OPEN, user })
        const newTask = await this.save(crateTask)
        return newTask
    }
}