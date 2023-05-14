import { FC } from 'react'
import { Todo } from '../../slices/sliceTypes'
import {
    deleteTodoThunk,
    toggleTodoCollapsed,
    toggleTodoProgress
} from '../../slices/todosSlice'
import { useAppDispatch } from '../../slices/store'
import { appDateFormat } from '../../dateFormat'
import { DragHandleProps } from '../sortableTree/types'

export const TodoItem: FC<{ item: Todo; categoryId: string; handleProps?: DragHandleProps }> = ({
    item,
    categoryId,
    handleProps,
}) => {

    const dispatch = useAppDispatch()



    const openEditor = (isEdit: boolean, addBefore?: boolean) => {
        // openModal({
        //     onSubmit: async (data: TodoEditValue) => {
        //         if (categoryId) {
        //             data.taskEnd = data.taskEnd ? moment(data.taskEnd, serverDateFormat) : undefined

        //             if (isEdit) {
        //                 await dispatch(
        //                     updateTodoThunk({
        //                         categoryId,
        //                         id: item.id,
        //                         todoDTO: data,
        //                     })
        //                 )
        //             } else {
        //                 await dispatch(
        //                     createTodoThunk({
        //                         categoryId,
        //                         ...data,
        //                         addBefore,
        //                         overId: item.id,
        //                     })
        //                 )
        //             }
        //         }
        //     },
        //     defaultValues: isEdit
        //         ? {
        //               value: item.value,
        //               taskEnd: item.taskEnd,
        //           }
        //         : undefined,
        //     fields: todoFields,
        // })
    }

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
                            openEditor(false, true)
                        }}
                    >
                        Add Up
                    </button>
                    <button
                        onClick={() => {
                            openEditor(false)
                        }}
                    >
                        Add Bottom
                    </button>
                    <button
                        onClick={() => {
                            openEditor(true)
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
