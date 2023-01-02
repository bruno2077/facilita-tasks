<template>
    <div class="taskContainer">
        
        <div class="taskTemp">
            <div class="bigIcon">
                <i class="fas fa-tools"></i>
            </div>
            <p>Em construção</p>            
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="stylus" scoped>
    .taskContainer 
        display: flex
        align-items: center
        justify-content: center
        background-color: #E9F4FB
        height: 100%
    .taskTemp
        .bigIcon
                display: flex
                align-items: center
                justify-content: center
                height: 200px
                width: 200px
                border-radius: 50%
                background-color: #F4FBFF
                margin: auto
                i
                    font-size: 100px
                    display: block
                    color: #4A6583
            > p
                text-align: center
                margin-top: 12px
                margin-bottom: 4px
                font-weight: 700
                font-size: 28px
                line-height: 21px
                color: #283848
                span
                    color: #FF4874

</style>