<template>
    <div>
        <p class="title">Entre com seus dados de acesso.</p>
        <b-input label="Nome de usuário ou e-mail:" class="inputs" v-model="username"/>
        <b-input label="Senha:" type="password" class="inputs" v-model="password"/>
        <button class="btn green loginBtn" @click="enter()">Entrar</button>
        <p class="forgotPass">
            <a href="#">Esqueci minha senha</a>
        </p>
    </div>
</template>

<script>
    import BrInput from './BrInput.vue'    
    export default {
        data(){
            return{
                username: '',
                whois: '',
                avatar: '',
                password: '',
                confirmPassword: '',
                signUp: false
            }
        },

        components: {
            'b-input' : BrInput
        },

        mounted(){            
            // Se tem usuário logado já preenche o form com seus dados.
            if(Object.keys(this.$store.state.user).length){
                this.username = `${this.$store.state.user.username}`
                this.whois = `${this.$store.state.user.whois}`
                this.avatar = `${this.$store.state.user.avatar}`
                this.password = `${this.$store.state.user.password}`
            }
        },

        methods:{    
            // Cria usuário ou faz login
            // No caso de login: com o 1º campo vazio loga com o usuário padrão.
            // No caso de criar: nome/email de usuário deve ser único.
            enter(){
                if(!this.signUp){ // LOGIN
                    let user
                    if(!this.username) // Carrega usuário padrão
                        user = this.findUser(1)                        
                    else user = this.findUser()
                    
                    if(user){
                        user.logged = true
                        user.lastLogin = new Date().getTime() // atualiza o horário do último login
                        this.$store.commit('loadUser', user) // Carrega o usuário logado na Store
                        this.$store.commit('updateUser', user) // Como modifica o horário do último login, atualiza na Store e no LocalStorage
                        
                        this.$router.push('/app') // tela dashboard
                    }
                    else alert("Usuário e/ou senha incorreto(s). DICA: Deixe o nome em branco para logar com usuário padrão!")
                }
            },
            
            // Procura o usuário na Store. retorna o usuário ou false em caso de erro.
            findUser(defaultUser = false){
                let user = {}
                if(defaultUser)
                    user = {...this.$store.state.users.filter(el => el.id === 1)[0] }
                else user = this.$store.state.users.filter(el => el.username === this.username && el.password === this.password)[0]
                
                if(Object.keys(user).length)
                    return user                
                return false // Não encontrado
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .title
        font-weight: 700
        color: #283848
        font-size: 18px
        margin-bottom: 20px
        line-height: 19px
    .inputs
        margin-top: 10px
        margin-bottom: 10px    
        width: 100%    
    .loginBtn
        margin-top: 10px
        margin-bottom: 10px
        width: 100%
    .forgotPass
        font-weight: 600
        font-size: 13px
        line-height: 14px
        margin-top: 20px
        a
            color: #2693FF
            &:visited, &:link, &:hover, &:active
                color: #2693FF
</style>