import { UserService } from '../services/userService'
import { SleepRecordService } from '../services/sleepRecordService'
import { SessionService } from '../services/sessionService'
import { StatisticsService } from '../services/statisticsService'
import { AiService } from '../services/aiService'

export type AppContext = {
  userService: UserService
  sleepRecordService: SleepRecordService
  sessionService: SessionService
  statisticsService: StatisticsService
  aiService: AiService
}
