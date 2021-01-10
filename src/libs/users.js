let users = []

export const joinUser = (id, username, room) =>  {
    const user = { id, username, room }
    users.push(user)
    return user
}

export const getUser = id => {
    return users.find(user => user.id === id)
} 

export const leaveUser = id => {
    const index = users.findIndex(user => user.id === id)
    
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}   

export const usersInRoom = room => {
    return users.filter(user => user.room === room)
}