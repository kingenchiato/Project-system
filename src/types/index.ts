export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed'

export interface Member {
  id: string
  name: string
  role: string
  email: string
  avatarColor: string
  department: string
  capacity: number
  allocated: number
}

export interface Task {
  id: string
  title: string
  projectId: string
  assigneeId: string
  status: TaskStatus
  priority: Priority
  dueDate: string
  estimateHours: number
  spentHours: number
  description: string
}

export interface Project {
  id: string
  name: string
  client: string
  status: ProjectStatus
  progress: number
  budget: number
  spent: number
  startDate: string
  endDate: string
  ownerId: string
  description: string
  tags: string[]
}

export interface Milestone {
  id: string
  projectId: string
  title: string
  date: string
  completed: boolean
}

export interface BudgetEntry {
  id: string
  projectId: string
  category: string
  planned: number
  actual: number
}

export interface AiInsight {
  id: string
  type: 'risk' | 'opportunity' | 'summary' | 'suggestion'
  title: string
  body: string
  relatedProjectId?: string
  createdAt: string
}
