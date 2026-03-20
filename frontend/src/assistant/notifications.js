import { ElMessage } from 'element-plus'

export function createElementPlusNotifier() {
  return {
    success(message) {
      ElMessage.success(message)
    },
    error(message) {
      ElMessage.error(message)
    },
    warning(message) {
      ElMessage.warning(message)
    },
    info(message) {
      ElMessage.info(message)
    }
  }
}
