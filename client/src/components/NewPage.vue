<template>
    <p>{{counter}}</p>
</template>

<script>
import gql from "graphql-tag";
export default {
    data: () => {
        return {
            counter:''
        }
    }, 
    apollo: {
        $subscribe: {
            counter: {
                query: gql`subscription { counter }`,                
                result({data}) {
                    this.counter = data.counter
                }
            }
        }        
    }
}
</script>