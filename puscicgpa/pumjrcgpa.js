function semester(index, sgpa_mjr, sgpa_eds) {
	this.index = index;
	this.sgpa_mjr = sgpa_mjr;
	this.sgpa_eds = sgpa_eds;

	function assign_credits() {
		if (this.index == 1 || this.index == 2) {
			this.credit_mjr = 8;
			this.credit_eds = 12;
		}
		if (this.index == 3 || this.index == 4) {
			this.credit_mjr = 12;
			this.credit_eds = 8;
		}
		if (this.index == 5 || this.index == 6) {
			this.credit_mjr = 20;
			this.credit_eds = 0;
			this.sgpa_eds = 0;
		}
		console.log("Major and Extra Departmental Credits assigned for" + this.index + "th semester");
	}
	assign_credits.call(this);
}

function calculateCGPA() {
	var sems = [];
	var i = new Number(0);
	var cgp_mjr = 0;
	var cgp = 0;
	var cgp_eds = 0;
	for (i = 1; i <= 6; i++) {
		sems.push(new semester(i))
	};

	for (i = 0; i < 6; i++) {
		var si = i + 1;
		sem_MJR_id = "sem" + si + "MJR";
		sem_EDS_id = "sem" + si + "ED";

		sems[i].sgpa_mjr = +document.getElementById(sem_MJR_id).value;
		console.log(sem_MJR_id, sems[i].sgpa_mjr);

		sems[i].sgpa_eds = +document.getElementById(sem_EDS_id).value;
		console.log(sem_EDS_id, sems[i].sgpa_eds);

		cgp += sems[i].sgpa_mjr * sems[i].credit_mjr + sems[i].sgpa_eds * sems[i].credit_eds;
		cgp_mjr += sems[i].sgpa_mjr * sems[i].credit_mjr;
		cgp_eds += sems[i].sgpa_eds * sems[i].credit_eds;
	}
	cgpa = cgp / 120;
	cgpa_mjr = cgp_mjr / 80;
	cgpa_eds = cgp_eds / 40;

	console.log("CGPA", cgpa);
	document.getElementById("cgpa_mjr").innerHTML = cgpa_mjr;
	document.getElementById("cgpa_eds").innerHTML = cgpa_eds;
	document.getElementById("cgpa").innerHTML = cgpa;
}
