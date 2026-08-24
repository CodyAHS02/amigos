/* ==========================================================
   AMIGOS MALER GMBH
   QUOTE CALCULATOR
   NEW INTERACTIVE CONFIGURATOR
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ==========================================================
           PROJECT DATA
        ========================================================== */


        const project = {


            property: "",
            room: "",
            service: "",
            wallShape: "",
            condition: "",
            size: "",
            finish: "",
            color: "",
            photos: [],
            notes: "",


            customer: {

                name: "",
                email: "",
                phone: "",
                city: ""

            }


        };





        /* ==========================================================
           STEPS
        ========================================================== */


        const steps = [



            {

                key: "property",

                title:
                    "What type of property are you painting?",

                description:
                    "Select your property type.",


                options: [


                    {
                        name: "Apartment",
                        icon: "🏢"
                    },


                    {
                        name: "House",
                        icon: "🏠"
                    },


                    {
                        name: "Office",
                        icon: "🏬"
                    },


                    {
                        name: "Commercial",
                        icon: "🏭"
                    }


                ]


            },






            {

                key: "room",

                title:
                    "Which area needs painting?",

                description:
                    "Choose the rooms included.",


                options: [


                    {
                        name: "Living Room",
                        icon: "🛋"
                    },


                    {
                        name: "Bedroom",
                        icon: "🛏"
                    },


                    {
                        name: "Kitchen",
                        icon: "🍽"
                    },


                    {
                        name: "Bathroom",
                        icon: "🚿"
                    },


                    {
                        name: "Multiple Rooms",
                        icon: "🏡"
                    }


                ]


            },






            {

                key: "service",

                title:
                    "What service do you need?",

                description:
                    "Choose your renovation work.",


                options: [


                    {
                        name: "Interior Painting",
                        icon: "🎨"
                    },


                    {
                        name: "Facade Painting",
                        icon: "🏠"
                    },


                    {
                        name: "Plaster Repair",
                        icon: "🧱"
                    },


                    {
                        name: "Wallpaper Removal",
                        icon: "🖼"
                    },


                    {
                        name: "Complete Renovation",
                        icon: "✨"
                    }


                ]


            },






            {

                key: "wallShape",

                title:
                    "What shape are your walls?",

                description:
                    "Help us understand your space.",


                wall: true,


                options: [


                    {
                        name: "Rectangle",
                        icon: "▭"
                    },


                    {
                        name: "L Shape",
                        icon: "└"
                    },


                    {
                        name: "Sloped",
                        icon: "◢"
                    },


                    {
                        name: "Multiple Walls",
                        icon: "▥"
                    },


                    {
                        name: "Custom",
                        icon: "＋"
                    }


                ]


            },






            {

                key: "condition",

                title:
                    "What condition are your walls?",

                description:
                    "Select the closest match.",


                options: [


                    {
                        name: "Excellent",
                        icon: "✨"
                    },


                    {
                        name: "Minor Repairs",
                        icon: "🛠"
                    },


                    {
                        name: "Needs Preparation",
                        icon: "🔨"
                    },


                    {
                        name: "Not Sure",
                        icon: "?"
                    }


                ]


            },






            {

                key: "size",

                title:
                    "Approximately how large is the project?",

                description:
                    "The size preview changes according to your selection.",


                visual: true,


                options: [


                    {
                        name: "Small Room",
                        image: "🏠"
                    },


                    {
                        name: "Medium Home",
                        image: "🏡"
                    },


                    {
                        name: "Large Property",
                        image: "🏘"
                    },


                    {
                        name: "Commercial",
                        image: "🏢"
                    }


                ]


            },






            {

                key: "finish",

                title:
                    "What finish style do you prefer?",

                description:
                    "Preview your wall style.",


                finish: true,


                options: [


                    {
                        name: "Classic White",
                        color: "#eeeeee"
                    },


                    {
                        name: "Greige",
                        color: "#c8b9a5"
                    },


                    {
                        name: "Modern Grey",
                        color: "#777777"
                    },


                    {
                        name: "Accent Wall",
                        color: "#34515e"
                    }


                ]


            },






            {

                key: "photos",

                title:
                    "Upload photos of your space",

                description:
                    "Photos help painters prepare better.",


                upload: true


            },






            {

                key: "notes",

                title:
                    "Add details about your project",

                description:
                    "Tell us anything important.",


                textarea: true


            },






            {

                key: "customer",

                title:
                    "Where should we send your offer?",

                description:
                    "Your details stay private.",


                contact: true


            }



        ];





        let current = 0;





        /* ==========================================================
           ELEMENTS
        ========================================================== */


        const container =
            document.getElementById(
                "qcStepContainer"
            );


        const summary =
            document.getElementById(
                "qcSummaryList"
            );


        const next =
            document.getElementById(
                "qcNextBtn"
            );


        const back =
            document.getElementById(
                "qcBackBtn"
            );


        const progress =
            document.getElementById(
                "qcProgressFill"
            );


        const currentStep =
            document.getElementById(
                "qcCurrentStep"
            );


        const total =
            document.getElementById(
                "qcTotalSteps"
            );


        const success =
            document.getElementById(
                "qcSuccessScreen"
            );



        total.innerHTML =
            steps.length;







        /* ==========================================================
           RENDER
        ========================================================== */


        function render() {


            let step =
                steps[current];



            container.innerHTML = "";



            let html = `


<h1>
${step.title}
</h1>


<p>
${step.description}
</p>


`;



            container.innerHTML = html;




            if (step.options) {


                let wrapper =
                    document.createElement(
                        "div"
                    );


                wrapper.className =
                    step.wall || step.finish
                        ?
                        "qc-options"
                        :
                        "qc-options";



                step.options.forEach(item => {


                    let card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "qc-option";



                    if (step.finish) {


                        card.innerHTML = `

<div style="
height:80px;
border-radius:20px;
background:${item.color};
margin-bottom:15px;">
</div>

${item.name}

`;


                    }

                    else if (step.visual) {


                        card.innerHTML = `

<div style="
font-size:70px;
margin-bottom:20px;">
${item.image}
</div>

${item.name}

`;

                    }

                    else {


                        card.innerHTML = `

<div style="
font-size:40px;
margin-bottom:15px;">
${item.icon}
</div>


${item.name}

`;


                    }



                    if (
                        project[step.key] === item.name
                    ) {


                        card.classList.add(
                            "active"
                        );


                    }



                    card.onclick = () => {


                        project[step.key] =
                            item.name;



                        updateSummary();


                        render();


                    };



                    wrapper.appendChild(card);


                });



                container.appendChild(wrapper);


            }






            if (step.upload) {


                container.innerHTML += `


<div class="qc-upload-box">


<input 
type="file"
id="qcUpload"
multiple
accept="image/*"
>


<label for="qcUpload">

＋ Upload Room Photos

</label>


<div id="qcImages"></div>


</div>


`;


                setTimeout(() => {


                    document
                        .getElementById("qcUpload")
                        .onchange = e => {


                            project.photos =
                                Array.from(
                                    e.target.files
                                );


                            document
                                .getElementById("qcImages")
                                .innerHTML =

                                project.photos.map(
                                    x =>

                                        `
<img src="${URL.createObjectURL(x)}">
`

                                ).join("");



                        };



                }, 100);


            }







            if (step.textarea) {


                container.innerHTML += `


<textarea
id="qcNotes"
placeholder="Tell us about your project">
</textarea>


`;



                setTimeout(() => {


                    document
                        .getElementById("qcNotes")
                        .oninput = e => {


                            project.notes =
                                e.target.value;


                        };



                }, 100);


            }






            if (step.contact) {


                container.innerHTML += `


<div class="qc-contact">


<input id="qcName" placeholder="Name">


<input id="qcEmail" placeholder="Email">


<input id="qcPhone" placeholder="Phone">


<input id="qcCity" placeholder="City">


</div>


`;



            }





            updateProgress();


        }










        /* ==========================================================
           SUMMARY
        ========================================================== */


        function updateSummary() {


            summary.innerHTML = "";



            Object.entries(project)
                .forEach(([key, value]) => {


                    if (
                        !value ||
                        Array.isArray(value) ||
                        typeof value === "object"
                    )
                        return;



                    summary.innerHTML += `

<li>

<strong>
${key}
</strong>

${value}

</li>

`;



                });


        }








        /* ==========================================================
           VALIDATION
        ========================================================== */


        function valid() {


            let step =
                steps[current];



            if (step.options) {


                return Boolean(
                    project[step.key]
                );


            }


            if (step.upload) {

                return project.photos.length;


            }



            if (step.textarea) {

                return project.notes.length > 5;


            }



            if (step.contact) {


                project.customer.name =
                    document.getElementById("qcName").value;


                project.customer.email =
                    document.getElementById("qcEmail").value;


                project.customer.phone =
                    document.getElementById("qcPhone").value;


                project.customer.city =
                    document.getElementById("qcCity").value;


                return (

                    project.customer.name &&
                    project.customer.email &&
                    project.customer.phone

                );


            }


            return true;


        }






        /* ==========================================================
           BUTTONS
        ========================================================== */


        next.onclick = () => {


            if (!valid()) {


                next.classList.add("shake");


                setTimeout(
                    () => next.classList.remove("shake"),
                    500
                );


                return;


            }




            if (current < steps.length - 1) {


                current++;

                transition();


            }

            else {


                finish();


            }


        };




        back.onclick = () => {


            if (current > 0) {


                current--;

                transition();


            }


        };







        function transition() {


            container.style.opacity = 0;


            setTimeout(() => {


                render();


                container.style.opacity = 1;


            }, 250);


        }








        /* ==========================================================
           PROGRESS
        ========================================================== */


        function updateProgress() {


            let percent =
                ((current + 1) / steps.length) * 100;


            progress.style.width =
                percent + "%";


            currentStep.innerHTML =
                current + 1;


        }







        /* ==========================================================
           FINAL ANIMATION
        ========================================================== */


        function finish() {


            success.style.opacity = 1;


            success.style.pointerEvents = "all";



            const list =
                document.getElementById(
                    "qcMatchingList"
                );



            setTimeout(() => {


                list.innerHTML += `

<div>
✓ Project analysed
</div>

`;

            }, 1500);



            setTimeout(() => {


                list.innerHTML += `

<div>
✓ Local painters matched
</div>

`;

            }, 3000);



            setTimeout(() => {


                document
                    .getElementById(
                        "qcSuccessTitle"
                    )
                    .innerHTML =

                    "Your request has been submitted";


            }, 5000);



            console.log(
                project
            );


        }






        render();


    });