import { appDateFormat } from '../../dateFormat'
import { Todo } from '../../slices/sliceTypes'
import { DragHandleProps } from '../sortableTree/types'
import { CheckBox } from './CheckBox'
import { MenuKeys, TodoMenu } from './TodoMenu'

type TodoItemContentProps = {
    item: Todo
    handleProps?: DragHandleProps
    switchEvent?: (key: MenuKeys) => void
    toggleColapsed?: () => void
    toggleProgress?: () => void
}

export const TodoItemContent = ({
    item,
    handleProps,
    switchEvent,
    toggleColapsed,
    toggleProgress,
}: TodoItemContentProps) => {
    const { value, taskEnd, isDone, showHideButton, isOpen } = item

    return (
        <div className={'todo__wrapper' + (switchEvent ? ' border-bottom' : '')}>
            <div className="move">
                <svg style={{ height: '100%', width: '16px' }} {...handleProps} viewBox="0 0 50 100">
                    <path d="M20,30 A5,5 0 0 1 30,30 A5,5 0 0 1 20,30 Z M20,50 A5,5 0 0 1 30,50 A5,5 0 0 1 20,50 Z M20,70 A5,5 0 0 1 30,70 A5,5 0 0 1 20,70 Z" />
                </svg>
            </div>
            {showHideButton && toggleColapsed ? (
                <div onClick={toggleColapsed} className={`arrow ${isOpen ? 'down' : ''}`}></div>
            ) : (
                <div className="empty"></div>
            )}

            <div className="item">
                <CheckBox size={16} checked={isDone} onChange={toggleProgress} />
            </div>
            <div className="todo__content">
                <div className="todo__value">{value}</div>
                {taskEnd && <div className="todo__date">{taskEnd.format(appDateFormat)}</div>}
            </div>
            {switchEvent && <TodoMenu switchEvent={switchEvent} />}
        </div>
    )
}
