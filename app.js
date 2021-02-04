const list = document.querySelector('ul');
const form = document.querySelector('form');


const addStudent = (student,id)=>{
    let html =  `
    <li data-id="${id}">
        <div>${student.name}</div>
        <div>${student.created_at.toDate()}</div>
        <button>delete</button>
    </li>
    `
    list.innerHTML += html;
}

const removeDom = (id)=>{
    // if li define in global then there is no li in html
    const li = document.querySelectorAll('li');
    li.forEach(i=>{
        if(i.getAttribute('data-id') === id){
            i.remove();
            console.log('item removed')
        }
    })
}

// getting database

/* normal way
studentDB.collection('Students').get().then(res=>{
    res.forEach(s=>{
        console.log(s.data())
    })
})
*/

// live database updates
studentDB.collection('Students').onSnapshot(snapshot=>{
    snapshot.docChanges().forEach(mySnapshot=>{
        const snap = mySnapshot.doc;
        if(mySnapshot.type === 'added'){
            addStudent(snap.data(),snap.id);
        } else if(mySnapshot.type === 'removed'){
            removeDom(snap.id);
        }
    })
});

// saving data 
form.addEventListener('submit', e=>{
    e.preventDefault();
    const now = new Date();
    let student = {
        name:form.user.value,
        created_at: firebase.firestore.Timestamp.fromDate(now)
    }
    studentDB.collection('Students').add(student).then(res=>{
        console.log('student added')
    });

    form.reset();
});

// deleting data
list.addEventListener('click', e=>{
    if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute('data-id');
        studentDB.collection('Students').doc(id).delete()
    }
})