import { FC } from 'react'
import { PutTodoDTO, Todo } from '../../slices/sliceTypes'
import { deleteTodoThunk, toggleTodoCollapsed, toggleTodoProgress } from '../../slices/todosSlice'
import { useAppDispatch } from '../../slices/store'
import { appDateFormat } from '../../dateFormat'
import { DragHandleProps } from '../sortableTree/types'

export const TodoItem: FC<{
    item: Todo
    categoryId: string
    handleProps?: DragHandleProps
    openEditModal: (id: string, defaultValues?: PutTodoDTO) => void
}> = ({ item, categoryId, handleProps, openEditModal }) => {
    const dispatch = useAppDispatch()

    const { id, value, taskEnd } = item

    return (
        <div
            style={{
                backgroundColor: 'red',
                height: '100%',
                width: '100%',
                userSelect: 'none',
                display: 'flex',
            }}
        >
            <div
                {...handleProps}
                style={{
                    position: 'absolute',
                    width: '20px',
                    height: '100%',
                    backgroundColor: 'yellowgreen',
                    left: -20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'move',
                }}
            >
                :
            </div>
            {item.showHideButton && (
                <div
                    onClick={() => {
                        dispatch(toggleTodoCollapsed(item.id))
                    }}
                >
                    {item.isOpen ? '🡫' : '>'}
                </div>
            )}
            <input
                type='checkbox'
                checked={item.isDone}
                onChange={() => dispatch(toggleTodoProgress(item.id))}
            />
            <div
                style={{
                    padding: '5px',
                    color: 'yellow',
                }}
            >
                {item.id}
            </div>
            <div>
                {item.value} <div>{item.taskEnd?.format(appDateFormat)}</div>
            </div>
            {
                <>
                    <button
                        onClick={() => {
                            // openEditor(false, true)
                        }}
                    >
                        Add Up
                    </button>
                    <button
                        onClick={() => {
                            // openEditor(false)
                        }}
                    >
                        Add Bottom
                    </button>
                    <button
                        onClick={() => {
                            // openEditor(true)
                            openEditModal(id, { value, taskEnd })
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            const response = window.confirm('Remove this item')

                            if (response) dispatch(deleteTodoThunk({ categoryId, id: item.id }))
                        }}
                    >
                        Delete
                    </button>
                </>
            }
        </div>
    )
}
