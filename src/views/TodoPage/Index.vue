<template>
	<div v-if="loggedUser" class="todoContainer">
		<b-navbar
			theme="blue"
			:direction="clientWidth > 768 ? 'column' : 'row'" 
			:logo="navLogo" 
			:links="navLinks"
			class="navBarMain"
			:avatar="clientWidth > 768 ? false : true"
		></b-navbar>
		<div class="todoRight">
			<b-navbar			
				theme="white"
				direction="row"
				class="navBarTop"
				avatar
			></b-navbar>
			<div class="todoRouterContainer">
				<router-view></router-view>
			</div>	
		</div>
	</div>
</template>

<script>	
	import NavBar from '../../components/NavBar.vue'
	
	export default {
		components:{
			'b-navbar': NavBar
		},
		data() {
			return {
				loggedUser: false,
				navLogo: 'logo.png',
				navLinks: [
					{
						icon: 'far fa-chart-bar',
						label: 'Dashboard',
						url: '/app/dashboard'
					},
					{
						icon: 'far fa-check-circle',
						label: 'Tarefas',
						url: '/app/tarefas'
					},
					{
						icon: 'fas fa-cogs',
						label: 'Configurações',
						url: '/app/config'
					},
				],
				clientWidth: Number(document.documentElement.clientWidth)
			}
		},

		mounted() {	
			const currentUser = {...this.$store.state.user}
			if(!Object.keys(currentUser).length) // Se não tem usuário logado redir pra loginPage
				this.$router.push('/')
			else {
				// console.log("[D index] loadUsers notes: ", JSON.parse(JSON.stringify(this.$store.state.users[0])))
				this.loggedUser = true
				window.addEventListener('resize', this.handleResize)
			}
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.handleResize)
		},

		methods: {
			handleResize() {
				this.clientWidth = Number(document.documentElement.clientWidth)
        	},
		}
    }
</script>

<style lang="stylus" scoped>
	.todoContainer
		display: flex
		height: 100vh
		width: 100vw
	.navBarMain
		width: 106px
	.todoRight
		flex: 1
		position: relative
	.navBarTop
		box-shadow: 0px 1px 6px 0px rgba(40, 56, 72, 0.07)
		width: 100%
		height: 83px
	.todoRouterContainer
		height: calc(100% - 83px) // desconta a navBarTop
	
	@media only screen and (max-width:768px)
		.todoContainer
			flex-direction: column
		.navBarMain
			width: 100%
			height: 83px
		.navBarTop
			display: none
		.todoRouterContainer
			height: 100%
</style>