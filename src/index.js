import { server, app } from './app'

server.listen(app.get('port'), () => console.log(`Server running on port ${app.get('port')}`))