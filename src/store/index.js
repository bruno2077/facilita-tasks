import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		users: [],
		notes: [],
		user: {}, // Somente os dados do usuário logado, sem as notas.  
	},	
	mutations: {
		loadUsers(state, users) {            
            state.users = JSON.parse(JSON.stringify(users))
        },
        loadUser(state, userData) {
            state.user = JSON.parse(JSON.stringify(userData))
        },  
        loadNotes(state, notesData) {
            state.notes = JSON.parse(JSON.stringify(notesData))
        },

        createUser(state, userData){
            state.users.push(userData)
            // Sempre atualiza TODO LocalStorage a cada alteração
            localStorage.setItem('appData', JSON.stringify([{users: state.users, notes: state.notes}]) ) 
        },
        updateUser(state, userData){
            for(let i = 0; i < state.users.length; i++){
                if(state.users[i].id === userData.id) {
                    state.users[i] = {...userData}
                    break
                }
            }
            localStorage.setItem('appData', JSON.stringify([{users: state.users, notes: state.notes}]) )
        },

        createNote(state, noteData){
            state.notes.push(noteData)
            localStorage.setItem('appData', JSON.stringify([{users: state.users, notes: state.notes}]) ) 

        },
        updateNote(state, noteData){
            for(let i = 0; state.notes.length; i++){
                if(state.notes[i].id === noteData.id){
                    state.notes[i] = {...noteData}
                    break
                }
            }
            localStorage.setItem('appData', JSON.stringify([{users: state.users, notes: state.notes}]) ) 
        },
        deleteNote(state, noteId){
            for(let i = 0; i < state.notes.length; i++){
                if(state.notes[i].id === noteId) {
                    state.notes.splice(i, 1)
                    break
                }
            }            
            localStorage.setItem('appData', JSON.stringify([{users: state.users, notes: state.notes}]) )
        },
	},
    getters: {
	},
	actions: {
	},
	modules: {
	}
})
