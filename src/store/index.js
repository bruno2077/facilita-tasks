import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		users: [],
		notes: [],
		user: {}, // Somente os dados do usuário logado, sem as notas.  
	},
	getters: {
		userNotes: state => {
            const notes = state.notes.filter(el => el.userId === state.user.id)
            console.log("[S] user notes na store: ", notes)
            return notes
        }
	},
	mutations: {
		loadUsers(state, users) {
            console.log("[S] loadUsers: ", JSON.parse(JSON.stringify(users)) )
            state.users = JSON.parse(JSON.stringify(users))
            // console.log("[S] loadUsers notes: ", state.users[0].notes.length)
        },
        loadUser(state, userData) {
            console.log("[S] loadUser: ", JSON.parse(JSON.stringify(userData)))
            // console.log("[S] loadUser user notes: ", state.users[0].notes)
            state.user = JSON.parse(JSON.stringify(userData))
            // console.log("[S] loadUser notes: ", state.users[0].notes)
        },  
        loadNotes(state, notesData) {
            console.log("[S] loadNotes: ", JSON.parse(JSON.stringify(notesData)))
            state.notes = JSON.parse(JSON.stringify(notesData))
        },

        createUser(state, userData){
            console.log("[S] createUser: ", userData)
            state.users.push({...userData})
            // localStorage.setItem('data', JSON.stringify({users: state.users}) )
        },
        updateUser(state, userData){
            for(let i = 0; i < state.users.length; i++){
                if(state.users[i].id === userData.id) {
                    // console.log("[S] users i ANTES update: ", state.users[i].notes)
                    state.users[i] = {...userData}
                    // console.log("[S] users i ao update: ", state.users[i].notes)
                    break
                }
            }
            // localStorage.setItem('data', JSON.stringify({users: state.users}) )
        },

        createNote(state, noteData){
            // noteData.id = newId(users)
            state.notes.push(noteData)
        },
        updateNote(state, noteData){
            for(let i = 0; state.notes.length; i++){
                if(state.notes[i].id === noteData.id){
                    state.notes[i] = {...noteData}
                    break
                }
            }
            // localStorage.setItem('data', JSON.stringify({users: state.users}) ) // Sempre atualiza TODO LocalStorage a cada alteração
        },
        deleteNote(state, noteId){
            for(let i = 0; i < state.notes.length; i++){
                if(state.notes[i].id === noteId) {
                    state.users[i].notes = state.users[i].notes.splice(j, 1)
                    break
                }
            }
            // localStorage.setItem('data', JSON.stringify({users: state.users}) ) 
        },
	},
	actions: {
	},
	modules: {
	}
})
