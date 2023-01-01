<template>
	<div class="login">
		<div class="logoArea">
			<img class="logo" src="../assets/img/logoFull.png" alt="Logo Facilita Tasks"/>
		</div>
		<div class="formArea">
			<LoginForm class="loginComponent"/>
        </div>
	</div>
</template>

<script>
	import LoginForm from '../components/LoginForm.vue'
	export default {
		components:{
			LoginForm
		},		
	}
</script>

<style lang="stylus" scoped>
	.login
		display: flex
		width: 100vw
		height: 100vh

	.logoArea
		background-color: #2693FF
		width: 35%
		display: flex
		align-items: center
		justify-content: center
	.logo
		width: 90%
		max-width: 330px
		height: auto
		margin-bottom: 50px
	
	.formArea
		display: flex
		width: 65%
		justify-content: center
		align-items: center
		// background-color: #666
	
	.loginComponent
		width: 368px
		height: fit-content

	@media only screen and (max-width:768px)
		.login
			flex-direction: column
			align-items: start
			justify-content: start
			width: 100%
		.logoArea
			width: 100%
			padding: 25px 0 100px 0
		
		.formArea
			width: 100%

		.loginComponent					
			margin-top: -120px
			margin-bottom: 40px
			padding: 20px
			background-color: #fff
			box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px
			// width: fit-content
			max-width: 90%
</style>