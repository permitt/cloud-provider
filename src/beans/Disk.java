package beans;

import beans.VM;

public class Disk {
    private String ime;
    private String tip;
    private int kapacitet;
    private Organizacija organizacija;
    private VM vm;



    public Disk(String ime, String tip, int kapacitet, Organizacija org, VM vm) {
        this.ime = ime;
        this.tip = tip;
        this.kapacitet = kapacitet;
        this.organizacija = org;
        this.vm = vm;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getTip() {
        return tip;
    }

    public void setTip(String tip) {
        this.tip = tip;
    }

    public int getKapacitet() {
        return kapacitet;
    }

    public void setKapacitet(int kapacitet) {
        this.kapacitet = kapacitet;
    }

    public VM getVm() {
        return vm;
    }

    public void setVm(VM vm) {
        this.vm = vm;
    }

    public Organizacija getOrganizacija() {
        return organizacija;
    }

    public void setOrganizacija(Organizacija org) {
        this.organizacija = org;
    }
}
