<template>
	<div class="mainContainer">
		<router-view></router-view>
	</div>
</template>

<script>
import defaultData from './assets/db.json'
export default {
	data() {
		return {
			loading: true
		}
	},

	mounted(){
		this.loadData()		
	},

	methods: {
		// Pega todos os dados no localstorage ou no JSON (dados padrão), e carrega na Store
		loadData(){
			let appData = JSON.parse(localStorage.getItem('appData'))
			if(appData && appData.length)
				appData = appData[0]
			
			if(!appData){
				appData = defaultData[0] // pega do JSON
			}
			
			this.$store.commit('loadUsers', appData.users)
			this.$store.commit('loadUser', this.currentUser(appData.users) )	
			this.$store.commit('loadNotes', appData.notes)
			this.loading = false		
		},

		// Se 1 ou + usuários fizeram login nos últimos 60minutos retorna o usuário logado mais recentemente. Ou {} se nenhum.
		currentUser(users){
			const now = new Date().getTime()
			let loggedUsers = users.filter(el => el.logged)
			if(loggedUsers.length > 1){
				loggedUsers.sort(this.compareByDate)
				if(now - Number(loggedUsers[0].lastLogin) <= 3600000){
					return loggedUsers[0]
				}
			}
			return {}
		},

		compareByDate(a, b) {
			if ( Number(a.lastLogin) < Number(b.lastLogin) )
				return 1			
			if ( Number(a.lastLogin) > Number(b.lastLogin) )
				return -1			
			return 0			
		}
	}
}
</script>

<style lang="stylus">
	*
		font-family: 'Gilroy', sans-serif
	.btn
		border: 0px
		cursor: pointer
		border-radius: 5px		
		height: 55px		
		font-size: 16px
		font-weight: 700
		line-height: 16.8px
		color: #fff
		&.green
			background: #1AD18F
			&:hover
				background: hsl(158, 78%, 40%)
		&.red
			background: #FF4874
			&:hover
				background: hsl(346, 100%, 58%)				
		&:disabled
			background: #A6C1D2
			pointer-events: none
		&.round
			border-radius: 50%
</style>