<template>    
    <div class="navBar" :class="defineClass()">
        <div class="imgContainer">
            <img v-if="logo" src="../assets/img/logo.png" alt="navbar icon" class="navLogo">
        </div>
        <div class="listContainer" :class="direction === 'column' ? 'column' : 'row'">
            <!-- show vertical -->
            <ul v-if="links && links.length && direction === 'column'" class="navList" :class="defineClass()">
                <router-link v-for="(link, index) in links" :key="index"
                    class="navLink" :class="url === link.url ? 'selected' : ''" 
                    :to="link.url" tag="li"
                >
                    <i :class="link.icon" @click="wat(link.url)"></i>
                    <span>{{link.label}}</span>
                </router-link>
            </ul>
            <!-- show horizontal -->
            <i v-else-if="links && links.length" class="fas fa-bars navMenu" :class="defineClass()"></i>
            <!-- Menu float aqui -->
        </div>
        <div>
            <span v-if="avatar" class="avatarContainer">
                <img :src="avatarUrl" alt="user avatar" class="avatarImg">
                <div v-if="direction !== 'column'" class="userInfo">
                    <div class="username" :class="defineClass()">{{$store.state.user.username}}</div>
                    <div class="userAbout" :class="defineClass()">{{$store.state.user.whois}}</div>
                </div>            
            </span>
        </div>        
    </div>
</template>

<script>
    const themes = ['blue', 'white']
    export default {
        props: {
            direction: String, // row || column
            color: String, // css color
            bgColor: String, // css color
            logo: String, // logo img name
            links: Array, // [ { icon, label, url },... ]
            avatar: Boolean, // show avatar or not
            bgSelected: String, // css color
            theme: String // color theme. current: 'blue', 'light'
        },

        data(){
            return {
                avatarUrl: require(`../assets/img/avatar/${this.$store.state.user.avatar}`)
            }
        },

        computed:{
            url(){
                return this.$route.name
            }
        },

        mounted(){
            console.log('rota: ', location.pathname)
        },

        methods: {
            defineStyle(){
                let style = ''
                // if(this.props.direction === 'column')
                //     style = 'flex-direction: column; height: 100vh'
                // else style = 'width: 100vh'

                style += this.color ? `color: ${this.color}; ` : 'color: #222; '
                style += this.bgColor ? `background-color: ${this.bgColor}; ` : 'background-color: #fff; '
                
                return style
            },
            defineClass(){
                let classToReturn = this.direction === 'column' ? 'column ' : 'row ' 
                classToReturn += themes.includes(this.theme) ? this.theme : 'white'

                return classToReturn
            },
            wat(url){
                console.log("waaaaat: ", url,)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .navBar
        position: relative
        display: flex
        align-items: center
        justify-content: space-between
        // Direction
        &.column
            flex-direction: column; height: 100%
        &.row
            width: 100%
        // Themes
        &.blue
            background-color: #2693FF
            color: #fff
        &.white
            background-color: #fff
            color: #222
        > div
            display: flex
            align-items: center
            justify-content: center
        &.row 
            padding-right: 32px
            .navLogo
                margin-left: 14px
            > div
                height: 100%            
        &.column 
            padding-bottom: 32px 
            .navLogo
                margin-top: 14px            
    
    .navLogo
        width: 55px

    .listContainer.row
        height: 100%
    .listContainer.column
        width: 100%

    .navList
        padding: 0px
        margin: 0px        
        // Direction
        &.row
            display: none 
            // .navLink
            //     width: 106px
            //     height: 100%
        &.column
            width: 100%
            .navLink
                width: 100%
                height: 83px
        // Themes
        &.blue
            .navLink:hover, .navLink.selected
                background-color: #1182F2
        &.white 
            .navLink:hover, .navLink.selected
                background-color: #DDD
        
    .navLink
        display: flex
        justify-content: center
        align-items: center
        margin: 0px        
        border: 1px solid #46A3FF
        cursor: pointer
        flex-direction: column
        > i
            font-size: 36px
            display: block            
        > span
            font-weight: 700
            font-size: 12px
            line-height: 13px
            a
                text-decoration: none
                color: #fff
                &:visited, &:link, &:hover, &:active
                    color: #fff
    
    .navMenu
        font-size: 40px
        padding: 10px 12px
        border-radius: 50%
        &.blue
            color: #fff
            &:hover
                background-color: #1182F2
        &.white
            color: #222
            &:hover
                background-color: #DDD

    .avatarContainer
        display: flex
        align-items: center
        .avatarImg
            height: 47px
            width: auto
            border-radius: 50%
        .username
            font-weight: 600
            font-size: 15px
            line-height: 16px
            margin-left: 10px
            &.blue, &.white
                color: #283848         
        .userAbout
            margin-left: 10px
            font-weight: 600
            font-size: 12px
            line-height: 13px
            &.blue 
                color: #fff
            &.white
                color: #2693FF

    @media only screen and (max-width:568px)
        .userInfo    
            display: none
    
</style>