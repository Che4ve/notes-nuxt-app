import{m as y,f as U,o as d,c as u,a as e,_ as B,H as S,I as D,B as M,J as q,r as C,K as V,D as g,E as T,b as k,w as F,T as H,F as w,q as G,L as J}from"./CdW2Co5G.js";import{u as K,C as j}from"./CGvO9Bwq.js";const z={class:"custom-checkbox"},A=["checked"],O=y({__name:"CustomCheckbox",props:{modelValue:{type:Boolean,required:!0}},emits:["update:modelValue"],setup(m,{emit:h}){const a=m;return U(()=>a.modelValue,()=>{console.log(a.modelValue)}),(i,s)=>(d(),u("label",z,[e("input",{type:"checkbox",checked:m.modelValue,onChange:s[0]||(s[0]=p=>i.$emit("update:modelValue",p.target.checked))},null,40,A),s[1]||(s[1]=e("span",{class:"custom-checkbox__checkmark"},null,-1))]))}}),P=B(O,[["__scopeId","data-v-ac3ee4f4"]]),Q={class:"edit-note"},W={class:"edit-note__todo-header"},X=["onUpdate:modelValue"],Y=["onClick"],Z=y({__name:"[id]",setup(m){var x,b;const h=S(),a=D(),i=String(h.params.id),s=K();M(s);const{getNoteById:p,updateNote:R}=s,f=q(()=>p(i)),_=C(((x=f.value)==null?void 0:x.title)||""),n=C(((b=f.value)==null?void 0:b.todoList.map(o=>({...o})))||[]),r=C(!1);V("todoListContainerRef");const v=V("addTodoButtonRef"),L=()=>{f.value&&(R({id:i,title:_.value,todoList:n.value.filter(o=>o.text.length>0)}),a.push("/"))},E=async()=>{if(n.value.push({id:Date.now().toString(),text:"",isCompleted:!1}),await J(),v){const o=v.value;setTimeout(()=>{o.parentElement&&(o.parentElement.scrollTop=o.parentElement.scrollHeight)},300)}},$=o=>{n.value=n.value.filter(t=>t.id!==o)},I=()=>{r.value=!0},N=()=>{r.value=!1,a.back()};return(o,t)=>(d(),u(w,null,[e("div",Q,[t[4]||(t[4]=e("h1",null,"Редактирование заметки",-1)),t[5]||(t[5]=e("label",{for:"title"},"Название",-1)),g(e("input",{id:"title",type:"text","onUpdate:modelValue":t[0]||(t[0]=l=>_.value=l),placeholder:"Введите название заметки"},null,512),[[T,_.value]]),e("div",W,[t[3]||(t[3]=e("h2",null,"Список дел",-1)),e("button",{onClick:t[1]||(t[1]=()=>{n.value=[]})}," Очистить ")]),k(H,{name:"todo-list",tag:"ul",ref:"todoListRef"},{default:F(()=>[(d(!0),u(w,null,G(n.value,l=>(d(),u("li",{key:`todo-${l.id}`},[k(P,{modelValue:l.isCompleted,"onUpdate:modelValue":c=>l.isCompleted=c},null,8,["modelValue","onUpdate:modelValue"]),g(e("input",{type:"text","onUpdate:modelValue":c=>l.text=c,placeholder:"Введите задачу"},null,8,X),[[T,l.text]]),e("button",{onClick:c=>$(l.id)},"Удалить",8,Y)]))),128)),(d(),u("li",{key:"todo-list__add-button",ref_key:"addTodoButtonRef",ref:v},[e("button",{class:"edit-note__add-todo-button",onClick:E}," Добавить дело ")]))]),_:1},512),e("div",{class:"edit-note__actions"},[e("button",{onClick:L},"Сохранить"),e("button",{onClick:I},"Назад")])]),k(j,{show:r.value,title:"Прекратить редактирование?",message:"Изменения не будут сохранены","confirm-text":"Выйти","cancel-text":"Остаться",onConfirm:N,onCancel:t[2]||(t[2]=()=>{r.value=!1})},null,8,["show"])],64))}}),oe=B(Z,[["__scopeId","data-v-6a620764"]]);export{oe as default};
